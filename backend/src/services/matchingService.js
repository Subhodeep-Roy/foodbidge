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

/**
 * executeNgoMatchingSkill
 * Delegates the full NGO scoring and ranking to the Python FastAPI AI engine.
 */
async function executeNgoMatchingSkill(donation, ngos) {
  let response;

  try {
    response = await fetch(PYTHON_AI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ donation, ngos }),
      signal: AbortSignal.timeout(10000)
    });
  } catch (err) {
    const error = new Error(
      `Python AI Matching Engine is unreachable at ${PYTHON_AI_URL}. ` +
      `Please start it with: py -m uvicorn ai.main:app --port 8000`
    );
    error.code = 'AI_ENGINE_UNAVAILABLE';
    throw error;
  }

  if (!response.ok) {
    const text = await response.text().catch(() => 'Unknown error');
    const error = new Error(`Python AI Engine returned HTTP ${response.status}: ${text}`);
    error.code = 'AI_ENGINE_ERROR';
    throw error;
  }

  return await response.json();
}

module.exports = {
  calculateDistanceKm,
  calculateFoodUrgency,
  executeNgoMatchingSkill
};
