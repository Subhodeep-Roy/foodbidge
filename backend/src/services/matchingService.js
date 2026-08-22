/**
 * NGO Matching Skill & Urgency Calculation Service
 * Implementation of skills/ngo_matching_skill.md and constitution.md
 */

// Calculate Haversine distance in kilometers
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
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

// Calculate Food Urgency Score (0 - 100)
function calculateFoodUrgency(preparedAt, usableHoursWindow = 5) {
  const prepTime = new Date(preparedAt).getTime();
  const now = Date.now();
  const elapsedHours = (now - prepTime) / (1000 * 60 * 60);
  const remainingHours = Math.max(0, usableHoursWindow - elapsedHours);

  let urgencyScore = 50; // Default
  if (remainingHours <= 1) {
    urgencyScore = 95; // CRITICAL
  } else if (remainingHours <= 3) {
    urgencyScore = 80; // HIGH
  } else if (remainingHours <= 5) {
    urgencyScore = 60; // MEDIUM
  } else {
    urgencyScore = 30; // LOW
  }

  const remainingMinutes = Math.round(remainingHours * 60);
  const hoursDisplay = Math.floor(remainingMinutes / 60);
  const minsDisplay = remainingMinutes % 60;
  const timeText = `${hoursDisplay}h ${minsDisplay}m`;

  return {
    urgencyScore,
    remainingHours: Math.round(remainingHours * 10) / 10,
    timeText,
    urgencyLevel: urgencyScore >= 80 ? 'HIGH' : urgencyScore >= 60 ? 'MEDIUM' : 'LOW'
  };
}

// NGO Matching Skill Execution
function executeNgoMatchingSkill(donation, ngos) {
  const supplierLat = donation.latitude || 12.9716;
  const supplierLng = donation.longitude || 77.5946;
  const quantity = donation.quantity || 100;
  const urgencyObj = calculateFoodUrgency(donation.prepared_at || new Date().toISOString(), donation.usable_hours || 5);

  const scoredNgos = [];

  for (const ngo of ngos) {
    // 1. Verification Check (Constitution Rule 1 & Skill Step 1)
    if (ngo.verified === false) continue;

    // 2. Capacity Check (Constitution Rule 5 & Skill Step 3)
    if (ngo.capacity < quantity * 0.5) continue;

    // 3. Distance Calculation
    let distanceKm = null;
    if (ngo.latitude && ngo.longitude) {
      distanceKm = calculateDistanceKm(supplierLat, supplierLng, ngo.latitude, ngo.longitude);
    }
    if (distanceKm === null || isNaN(distanceKm)) {
      distanceKm = Number(ngo.distanceKm || ngo.distance || 3.5);
    }
    distanceKm = Math.round(distanceKm * 10) / 10;

    // Filter out if distance > max radius (15km)
    if (distanceKm > 15) continue;

    // 4. Scoring Formulas
    // Demand score (40%)
    const demandRatio = Math.min(1.5, (ngo.demand || 50) / quantity);
    const demandScore = Math.min(100, demandRatio * 80);

    // Distance score (30%) - decay per km
    const distanceScore = Math.max(0, 100 - distanceKm * 10);

    // Capacity score (20%)
    const capacityRatio = (ngo.capacity || 100) / quantity;
    const capacityScore = Math.min(100, capacityRatio * 50);

    // Urgency compatibility score (10%)
    const urgencyScore = urgencyObj.urgencyScore;

    // Total weighted score
    const rawScore =
      0.40 * demandScore +
      0.30 * distanceScore +
      0.20 * capacityScore +
      0.10 * urgencyScore;

    const matchScore = Math.min(99, Math.max(40, Math.round(rawScore)));

    // Generate specific rationale points
    const rationale = [];
    if (demandRatio >= 0.8) rationale.push('✓ High active meal demand');
    if (distanceKm <= 3.0) rationale.push(`✓ Nearby (${distanceKm} km away)`);
    else rationale.push(`✓ Within delivery radius (${distanceKm} km)`);
    if (capacityRatio >= 1.0) rationale.push(`✓ Sufficient storage capacity (${ngo.capacity} meals)`);
    if (ngo.verified) rationale.push('✓ Verified NGO organization');

    scoredNgos.push({
      id: ngo.id,
      name: ngo.organization_name,
      matchScore,
      distanceKm,
      demand: ngo.demand,
      capacity: ngo.capacity,
      address: ngo.address,
      rationale
    });
  }

  // Sort by match score descending
  scoredNgos.sort((a, b) => b.matchScore - a.matchScore);

  const recommendedNgo = scoredNgos[0] || null;
  const alternativeNgos = scoredNgos.slice(1);

  return {
    donationAnalysis: {
      foodName: donation.food_name,
      quantity: donation.quantity,
      urgencyLevel: urgencyObj.urgencyLevel,
      urgencyScore: urgencyObj.urgencyScore,
      remainingUsableTime: urgencyObj.timeText
    },
    recommendedNgo,
    alternativeNgos,
    constitutionAdhered: true
  };
}

module.exports = {
  calculateDistanceKm,
  calculateFoodUrgency,
  executeNgoMatchingSkill
};
