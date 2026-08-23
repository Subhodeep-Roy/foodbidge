# FoodBridge Architecture & System Design

## Overview
FoodBridge is an AI-driven surplus food rescue and distribution engine. It connects food suppliers (restaurants, hotels, supermarkets) with verified non-governmental organizations (NGOs) and local volunteer logistics networks.

---

## Technical Stack

- **Frontend**: React (Vite), Modern Vanilla CSS Design System with Glassmorphic visual components, dynamic animations, and interactive state management.
- **Backend API**: Node.js & Express RESTful API with automated NGO matching engine and calculation services.
- **Database Model**: Relational PostgreSQL schema (with JSON/in-memory database compatibility layer for dev & testing).
- **AI Agent Layer**: Food Rescue Coordinator Agent governing rescue workflows under strict safety rules defined in `constitution.md`.
- **Custom Skills**: NGO Matching Skill algorithm executing 4-weighted vector scoring.

---

## Architecture Diagram

```text
                    ┌─────────────────────┐
                    │      FoodBridge     │
                    │      Frontend       │
                    │    React (Vite)     │
                    └──────────┬──────────┘
                               │
                         REST / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │     Backend API     │
                    │  Node.js + Express  │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌─────────────┐  ┌─────────────┐
       │ PostgreSQL │   │ AI Services │  │ Maps / Geo  │
       │ Database   │   │ Python API  │  │ API         │
       └────────────┘   └──────┬──────┘  └─────────────┘
                               │
                               ▼
                     ┌──────────────────┐
                     │ Food Rescue Agent│
                     └────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        Spoilage Skill   NGO Matching     Route Skill
```

---

## Database Model

```text
USERS
-----
id (UUID, Primary Key)
name (String)
email (String, Unique)
password_hash (String)
role (Enum: SUPPLIER, NGO, VOLUNTEER, ADMIN)
created_at (Timestamp)


SUPPLIERS
---------
id (UUID, Primary Key)
user_id (Foreign Key -> USERS.id)
organization_name (String)
address (Text)
latitude (Float)
longitude (Float)


NGOS
---
id (UUID, Primary Key)
user_id (Foreign Key -> USERS.id)
organization_name (String)
address (Text)
latitude (Float)
longitude (Float)
capacity (Integer)
verified (Boolean)


DONATIONS
---------
id (UUID, Primary Key)
supplier_id (Foreign Key -> SUPPLIERS.id)
food_name (String)
quantity (Integer)
food_type (Enum: VEGETARIAN, NON_VEGETARIAN, VEGAN, BAKERY, PACKAGED)
prepared_at (Timestamp)
expiry_estimate (Timestamp)
status (Enum: AVAILABLE, MATCHED, PICKED_UP, DELIVERED, EXPIRED)
urgency_score (Float)
created_at (Timestamp)


DONATION_REQUESTS
-----------------
id (UUID, Primary Key)
donation_id (Foreign Key -> DONATIONS.id)
ngo_id (Foreign Key -> NGOS.id)
status (Enum: PENDING, ACCEPTED, REJECTED)
requested_at (Timestamp)


PICKUPS
-------
id (UUID, Primary Key)
donation_id (Foreign Key -> DONATIONS.id)
ngo_id (Foreign Key -> NGOS.id)
volunteer_id (Foreign Key -> USERS.id)
pickup_time (Timestamp)
status (Enum: SCHEDULED, IN_TRANSIT, COMPLETED)


IMPACT
------
id (UUID, Primary Key)
donation_id (Foreign Key -> DONATIONS.id)
meals_served (Integer)
food_saved_kg (Float)
co2_saved_kg (Float)
created_at (Timestamp)
```

---

## AI Rescue Agent Flow

1. **Donation Creation**: Supplier posts fresh food surplus details.
2. **Analysis & Spoilage Estimation**: Food rescue agent calculates remaining usable time and urgency score.
3. **NGO Candidate Filtering**: Filters out unverified, over-capacity, or out-of-range NGOs.
4. **NGO Matching Skill Execution**: Ranks candidates using weighted algorithm:
   - **40%** — Food demand match
   - **30%** — Proximity & distance
   - **20%** — Storage capacity
   - **10%** — Urgency score multiplier
5. **Recommendation & Transparency Log**: Provides top recommended NGO with clear textual rationale.
6. **Human Override / Confirmation**: Supplier accepts recommendation to assign pickup volunteer and update impact metrics.
