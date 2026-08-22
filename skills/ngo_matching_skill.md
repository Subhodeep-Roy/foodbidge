# NGO Matching Skill

## Purpose
Identify the most suitable NGO recipient for a surplus food donation by evaluating geographic proximity, demand alignment, receiving capacity, and time urgency.

---

## Inputs

- `donation_quantity` (Integer)
- `food_type` (Enum: VEGETARIAN, NON_VEGETARIAN, VEGAN, BAKERY, PACKAGED)
- `supplier_location` ({ latitude: Float, longitude: Float })
- `food_urgency` (Score 0-100 based on remaining shelf life)
- `ngo_location` ({ latitude: Float, longitude: Float })
- `ngo_capacity` (Integer)
- `ngo_demand` (Integer)
- `ngo_verified` (Boolean)

---

## Execution Process

1. **Verification Filter**: Remove unverified NGOs (`ngo.verified === false`).
2. **Radius Filter**: Remove NGOs outside max delivery radius (e.g., > 15 km).
3. **Capacity Filter**: Remove NGOs where `ngo.capacity < donation_quantity * 0.8`.
4. **Distance Calculation**: Compute geodesic distance (Haversine formula).
5. **Demand Compatibility**: Evaluate ratio of NGO active meal demand relative to donation quantity.
6. **Urgency Compatibility**: Adjust weight based on remaining safe window (high urgency heavily penalizes distance).
7. **Score Generation**: Compute final percentage score using weighted formula.
8. **Candidate Ranking**: Sort eligible candidates by score in descending order.

---

## Scoring Formula

$$\text{Matching Score} = (0.40 \times S_{\text{demand}}) + (0.30 \times S_{\text{distance}}) + (0.20 \times S_{\text{capacity}}) + (0.10 \times S_{\text{urgency}})$$

- **40% — Food Demand**: Higher score if NGO's active demand closely matches or exceeds donation size.
- **30% — Distance / Proximity**: Exponential decay based on kilometers away ($S_{\text{distance}} = \max(0, 100 - (\text{dist\_km} \times 10))$).
- **20% — Receiving Capacity**: Score based on available storage capacity.
- **10% — Urgency Compatibility**: Bonus multiplier for rapid-dispatch needs.

---

## Standard JSON Output Format

```json
{
  "recommended_ngo": {
    "id": "ngo_101",
    "name": "Hope Foundation",
    "match_score": 94,
    "distance_km": 2.4,
    "demand": 80,
    "capacity": 120
  },
  "alternative_ngos": [
    {
      "id": "ngo_102",
      "name": "Care Shelter",
      "match_score": 81,
      "distance_km": 5.1,
      "demand": 150,
      "capacity": 200
    }
  ],
  "explanation": [
    "High demand match for 100 vegetarian meals",
    "Located nearby within 2.4 km radius",
    "Sufficient receiving capacity (120 meals)",
    "Optimal pick-up dispatch window"
  ]
}
```
