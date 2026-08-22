# Agents and Skills Specification

This document summarizes the AI Agent and Custom Skill architecture implemented in **FoodBridge**.

---

## Custom Agent

### Food Rescue Coordinator Agent

- **Location**: [`/agents/food_rescue_agent.md`](file:///c:/foodbridge/agents/food_rescue_agent.md)
- **Purpose**: Coordinates the end-to-end food rescue workflow from donation creation to NGO recommendation, logistics dispatch, and impact tracking.
- **Responsibilities**:
  - Ingest food donation parameters.
  - Compute urgency & safe consumption window.
  - Query eligible local NGOs.
  - Invoke NGO Matching Skill.
  - Generate human-readable recommendation breakdown.
  - Maintain decision audit logs.

---

## Custom Skill

### NGO Matching Skill

- **Location**: [`/skills/ngo_matching_skill.md`](file:///c:/foodbridge/skills/ngo_matching_skill.md)
- **Purpose**: Evaluates candidate NGOs against surplus food donations using multi-factor weighted scoring.
- **Inputs**:
  - Food quantity & category.
  - Preparation & expiry timestamp.
  - Supplier geo-coordinates.
  - NGO geo-coordinates, receiving capacity, demand, and verification status.
- **Outputs**:
  - Primary recommended NGO.
  - Ranked list of alternative candidate NGOs.
  - Overall match score (0–100%).
  - Transparent rationale checklist.

---

## Agent-Skill Interaction Flow

```text
Food Rescue Coordinator Agent
            │
            ▼
      NGO Matching Skill
            │
            ▼
       Ranked NGOs
            │
            ▼
      Agent Recommendation
```
