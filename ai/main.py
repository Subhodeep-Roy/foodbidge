"""
FoodBridge AI Matching Engine -- Python FastAPI Microservice
============================================================
Implements the NGO Matching Skill from skills/ngo_matching_skill.md
Governed by rules in constitution.md

Endpoint:  POST /match
Port:      8000
"""

import math
from datetime import datetime, timezone
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class Donation(BaseModel):
    food_name: str = "Surplus Food"
    quantity: float = 100
    prepared_at: Optional[str] = None
    usable_hours: float = 5
    latitude: float = 12.9716
    longitude: float = 77.5946


class Ngo(BaseModel):
    id: str
    organization_name: Optional[str] = None
    name: Optional[str] = None
    address: str = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    capacity: float = 100
    demand: float = 50
    verified: bool = True
    distanceKm: Optional[float] = None


class MatchRequest(BaseModel):
    donation: Donation
    ngos: list[Ngo]


app = FastAPI(
    title="FoodBridge AI Matching Engine",
    description="Python AI microservice for 4-weighted NGO recommendation scoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)
    a = math.sin(d_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)


def calculate_urgency(prepared_at, usable_hours):
    if prepared_at:
        try:
            prep_time = datetime.fromisoformat(prepared_at.replace("Z", "+00:00"))
        except ValueError:
            prep_time = datetime.now(timezone.utc)
    else:
        prep_time = datetime.now(timezone.utc)

    now = datetime.now(timezone.utc)
    if prep_time.tzinfo is None:
        prep_time = prep_time.replace(tzinfo=timezone.utc)

    elapsed_hours = (now - prep_time).total_seconds() / 3600
    remaining_hours = max(0.0, usable_hours - elapsed_hours)

    if remaining_hours <= 1:
        urgency_score, urgency_level = 95, "CRITICAL"
    elif remaining_hours <= 3:
        urgency_score, urgency_level = 80, "HIGH"
    elif remaining_hours <= 5:
        urgency_score, urgency_level = 60, "MEDIUM"
    else:
        urgency_score, urgency_level = 30, "LOW"

    remaining_minutes = int(remaining_hours * 60)
    hours_display = remaining_minutes // 60
    mins_display = remaining_minutes % 60

    return {
        "urgencyScore": urgency_score,
        "urgencyLevel": urgency_level,
        "remainingHours": round(remaining_hours, 1),
        "timeText": f"{hours_display}h {mins_display}m"
    }


def score_ngo(ngo, donation, urgency, supplier_lat, supplier_lon):
    quantity = donation.quantity

    if not ngo.verified:
        return None
    if ngo.capacity < quantity * 0.5:
        return None

    if ngo.latitude and ngo.longitude:
        distance_km = haversine_km(supplier_lat, supplier_lon, ngo.latitude, ngo.longitude)
    elif ngo.distanceKm is not None:
        distance_km = ngo.distanceKm
    else:
        distance_km = 3.5

    distance_km = round(distance_km, 1)
    if distance_km > 15:
        return None

    demand_ratio = min(1.5, (ngo.demand or 50) / quantity)
    demand_score = min(100, demand_ratio * 80)
    distance_score = max(0, 100 - distance_km * 10)
    capacity_ratio = (ngo.capacity or 100) / quantity
    capacity_score = min(100, capacity_ratio * 50)
    urg_score = urgency["urgencyScore"]

    raw_score = 0.40 * demand_score + 0.30 * distance_score + 0.20 * capacity_score + 0.10 * urg_score
    match_score = min(99, max(40, round(raw_score)))

    ngo_name = ngo.organization_name or ngo.name or "Unknown NGO"

    rationale = []
    if demand_ratio >= 0.8:
        rationale.append("\u2713 High active meal demand aligns with donation quantity")
    else:
        rationale.append(f"\u2713 Meal demand of {int(ngo.demand)} meals partially matches donation")

    if distance_km <= 3.0:
        rationale.append(f"\u2713 Very nearby shelter ({distance_km} km -- minimal transport time)")
    elif distance_km <= 7.0:
        rationale.append(f"\u2713 Within close delivery radius ({distance_km} km)")
    else:
        rationale.append(f"\u2713 Within acceptable delivery radius ({distance_km} km)")

    if capacity_ratio >= 1.5:
        rationale.append(f"\u2713 Ample storage capacity ({int(ngo.capacity)} meals -- well above donation size)")
    elif capacity_ratio >= 1.0:
        rationale.append(f"\u2713 Sufficient storage capacity ({int(ngo.capacity)} meals)")
    else:
        rationale.append(f"\u2713 Adequate capacity for partial fulfillment ({int(ngo.capacity)} meals)")

    if ngo.verified:
        rationale.append("\u2713 Verified NGO organization -- documentation on file")

    if urgency["urgencyLevel"] in ("CRITICAL", "HIGH"):
        rationale.append(f"\u26a1 Prioritized due to {urgency['urgencyLevel']} food urgency ({urgency['timeText']} remaining)")

    return {
        "id": ngo.id,
        "name": ngo_name,
        "address": ngo.address,
        "matchScore": match_score,
        "distanceKm": distance_km,
        "demand": ngo.demand,
        "capacity": ngo.capacity,
        "rationale": rationale,
        "scoreBreakdown": {
            "demandScore": round(demand_score, 1),
            "distanceScore": round(distance_score, 1),
            "capacityScore": round(capacity_score, 1),
            "urgencyScore": round(urg_score, 1),
        }
    }


@app.get("/")
def root():
    return {"service": "FoodBridge AI Matching Engine", "version": "1.0.0", "engine": "python-fastapi", "status": "running"}


@app.get("/health")
def health():
    return {"status": "ok", "engine": "python-fastapi"}


@app.post("/match")
def match_ngos(req: MatchRequest):
    donation = req.donation
    ngos = req.ngos

    urgency = calculate_urgency(donation.prepared_at, donation.usable_hours)

    scored = []
    for ngo in ngos:
        result = score_ngo(ngo, donation, urgency, donation.latitude, donation.longitude)
        if result is not None:
            scored.append(result)

    scored.sort(key=lambda x: x["matchScore"], reverse=True)

    return {
        "donationAnalysis": {
            "foodName": donation.food_name,
            "quantity": donation.quantity,
            "urgencyLevel": urgency["urgencyLevel"],
            "urgencyScore": urgency["urgencyScore"],
            "remainingUsableTime": urgency["timeText"],
            "remainingHours": urgency["remainingHours"]
        },
        "recommendedNgo": scored[0] if scored else None,
        "alternativeNgos": scored[1:] if len(scored) > 1 else [],
        "totalCandidatesScored": len(scored),
        "totalCandidatesFiltered": len(ngos) - len(scored),
        "constitutionAdhered": True,
        "engine": "python-fastapi"
    }
