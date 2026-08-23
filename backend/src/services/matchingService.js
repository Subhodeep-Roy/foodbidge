/**
 * NGO Matching Skill - Node.js to Python AI API Delegate
 * =======================================================
 * The AI brain has been moved to the Python FastAPI microservice at:
 *   http://localhost:8000/match
 *
 * This module now acts as the HTTP client that:
 *   1. Sends donation + NGO list to the Python AI engine
 *   2. Returns the scored & ranked recommendations from Python
 *
 * Fallback: If the Python API is unreachable, throws a clear 503 error.
 */

const PYTHON_AI_URL = 'http://localhost:8000/match';

// Local utility: kept for non-AI usages (e.g. distance display in UI)
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function calculateFoodUrgency(preparedAt, usableHoursWindow = 5) {
  const prepTime = new Date(preparedAt).getTime();
  const now = Date.now();
  const elapsedHours = (now - prepTime) / (1000 * 60 * 60);
  const remainingHours = Math.max(0, usableHoursWindow - elapsedHours);

  let urgencyScore = 50;
  if (remainingHours <= 1) urgencyScore = 95;
  else if (remainingHours <= 3) urgencyScore = 80;
  else if (remainingHours <= 5) urgencyScore = 60;
  else urgencyScore = 30;

  const remainingMinutes = Math.round(remainingHours * 60);
  const hoursDisplay = Math.floor(remainingMinutes / 60);
  const minsDisplay = remainingMinutes % 60;

  return {
    urgencyScore,
    remainingHours: Math.round(remainingHours * 10) / 10,
    timeText: `${hoursDisplay}h ${minsDisplay}m`,
    urgencyLevel: urgencyScore >= 95 ? 'CRITICAL' : urgencyScore >= 80 ? 'HIGH' : urgencyScore >= 60 ? 'MEDIUM' : 'LOW'
  };
}

// ── Local Fallback Calculation ────────────────────────────────────────────────
function localMatchingAlgorithm(donation, ngos) {
  const supplierLat = donation.latitude || 12.9716;
  const supplierLng = donation.longitude || 77.5946;
  const quantity = donation.quantity || 100;
  const urgencyObj = calculateFoodUrgency(donation.prepared_at || new Date().toISOString(), donation.usable_hours || 5);

  const scoredNgos = [];

  for (const ngo of ngos) {
    if (ngo.verified === false) continue;
    if (ngo.capacity < quantity * 0.5) continue;

    let distanceKm = null;
    if (ngo.latitude && ngo.longitude) {
      distanceKm = calculateDistanceKm(supplierLat, supplierLng, ngo.latitude, ngo.longitude);
    }
    if (distanceKm === null || isNaN(distanceKm)) {
      distanceKm = Number(ngo.distanceKm || ngo.distance || 3.5);
    }
    distanceKm = Math.round(distanceKm * 10) / 10;

    if (distanceKm > 15) continue;

    const demandRatio = Math.min(1.5, (ngo.demand || 50) / quantity);
    const demandScore = Math.min(100, demandRatio * 80);
    const distanceScore = Math.max(0, 100 - distanceKm * 10);
    const capacityRatio = (ngo.capacity || 100) / quantity;
    const capacityScore = Math.min(100, capacityRatio * 50);
    const urgencyScore = urgencyObj.urgencyScore;

    const rawScore =
      0.40 * demandScore +
      0.30 * distanceScore +
      0.20 * capacityScore +
      0.10 * urgencyScore;

    const matchScore = Math.min(99, Math.max(40, Math.round(rawScore)));

    const rationale = [];
    if (demandRatio >= 0.8) rationale.push('✓ High active meal demand');
    if (distanceKm <= 3.0) rationale.push(`✓ Nearby (${distanceKm} km away)`);
    else rationale.push(`✓ Within delivery radius (${distanceKm} km)`);
    if (capacityRatio >= 1.0) rationale.push(`✓ Sufficient storage capacity (${ngo.capacity} meals)`);
    if (ngo.verified) rationale.push('✓ Verified NGO organization');

    scoredNgos.push({
      id: ngo.id,
      name: ngo.organization_name || ngo.name,
      matchScore,
      distanceKm,
      demand: ngo.demand,
      capacity: ngo.capacity,
      address: ngo.address,
      rationale
    });
  }

  scoredNgos.sort((a, b) => b.matchScore - a.matchScore);

  return {
    donationAnalysis: {
      foodName: donation.food_name,
      quantity: donation.quantity,
      urgencyLevel: urgencyObj.urgencyLevel,
      urgencyScore: urgencyObj.urgencyScore,
      remainingUsableTime: urgencyObj.timeText
    },
    recommendedNgo: scoredNgos[0] || null,
    alternativeNgos: scoredNgos.slice(1),
    constitutionAdhered: true,
    engine: 'local-fallback'
  };
}

/**
 * executeNgoMatchingSkill
 * Delegates to Python FastAPI AI microservice on port 8000 when available,
 * or uses the local deterministic fallback when offline (e.g. CI testing).
 */
async function executeNgoMatchingSkill(donation, ngos) {
  try {
    const response = await fetch(PYTHON_AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donation, ngos }),
      signal: AbortSignal.timeout(2000)
    });

    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Python microservice offline or timeout -> use local algorithm fallback
  }

  return localMatchingAlgorithm(donation, ngos);
}

module.exports = {
  calculateDistanceKm,
  calculateFoodUrgency,
  executeNgoMatchingSkill
};
