const request = require('supertest');
const app = require('../src/server');
const {
  calculateDistanceKm,
  calculateFoodUrgency,
  executeNgoMatchingSkill
} = require('../src/services/matchingService');

describe('NGO Matching Skill & Urgency Unit Tests', () => {
  test('calculateDistanceKm should calculate accurate geographic distance', () => {
    const dist = calculateDistanceKm(12.9784, 77.6408, 12.9352, 77.6245);
    expect(dist).toBeGreaterThan(4.5);
    expect(dist).toBeLessThan(6.5);
  });

  test('calculateFoodUrgency should assign HIGH urgency for meals expiring within 3 hours', () => {
    const twoHoursAgo = new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString();
    const urgency = calculateFoodUrgency(twoHoursAgo, 5);
    expect(urgency.urgencyLevel).toBe('HIGH');
    expect(urgency.urgencyScore).toBeGreaterThanOrEqual(80);
  });

  test('executeNgoMatchingSkill should exclude unverified NGOs per Constitution Rule 1', () => {
    const donation = {
      food_name: '50 Meals',
      quantity: 50,
      latitude: 12.9716,
      longitude: 77.5946
    };

    const ngos = [
      {
        id: 'unverified_1',
        organization_name: 'Unverified Shelter',
        capacity: 100,
        demand: 50,
        verified: false,
        latitude: 12.9716,
        longitude: 77.5946
      },
      {
        id: 'verified_1',
        organization_name: 'Verified Shelter',
        capacity: 100,
        demand: 50,
        verified: true,
        latitude: 12.9716,
        longitude: 77.5946
      }
    ];

    const result = executeNgoMatchingSkill(donation, ngos);
    expect(result.recommendedNgo.id).toBe('verified_1');
    expect(result.alternativeNgos.length).toBe(0);
  });

  test('executeNgoMatchingSkill should score higher for closer NGOs with higher demand', () => {
    const donation = {
      food_name: '100 Meals',
      quantity: 100,
      latitude: 12.9716,
      longitude: 77.5946
    };

    const ngos = [
      {
        id: 'far_ngo',
        organization_name: 'Far NGO',
        capacity: 100,
        demand: 40,
        verified: true,
        latitude: 12.9400,
        longitude: 77.5600
      },
      {
        id: 'close_ngo',
        organization_name: 'Close NGO',
        capacity: 150,
        demand: 120,
        verified: true,
        latitude: 12.9720,
        longitude: 77.5950
      }
    ];

    const result = executeNgoMatchingSkill(donation, ngos);
    expect(result.recommendedNgo.id).toBe('close_ngo');
    expect(result.recommendedNgo.matchScore).toBeGreaterThan(result.alternativeNgos[0].matchScore);
  });
});

describe('API Routes & Multi-NGO Request Broadcasting Integration Tests', () => {
  test('GET /health returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('POST /api/requests/broadcast sends request to multiple selected NGOs', async () => {
    const res = await request(app)
      .post('/api/requests/broadcast')
      .send({
        donationId: 'don_1',
        selectedNgoIds: ['ngo_1', 'ngo_2']
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.requests.length).toBe(2);
  });

  test('GET /api/ngos/:ngoId/requests returns pending requests for NGO', async () => {
    const res = await request(app).get('/api/ngos/ngo_1/requests');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.requests.length).toBeGreaterThan(0);
  });

  test('POST /api/requests/respond with ACCEPT assigns pickup', async () => {
    const reqRes = await request(app).get('/api/ngos/ngo_1/requests');
    const reqId = reqRes.body.requests[0].id;

    const res = await request(app)
      .post('/api/requests/respond')
      .send({
        requestId: reqId,
        ngoId: 'ngo_1',
        action: 'ACCEPT'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('ACCEPTED');
    expect(res.body.pickup).toBeDefined();
  });

  test('POST /api/requests/respond with ACCEPT by second NGO triggers race condition conflict 409', async () => {
    const reqRes = await request(app).get('/api/ngos/ngo_2/requests');
    const reqId = reqRes.body.requests[0].id;

    const res = await request(app)
      .post('/api/requests/respond')
      .send({
        requestId: reqId,
        ngoId: 'ngo_2',
        action: 'ACCEPT'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toBe('ALREADY_ACCEPTED');
    expect(res.body.message).toBe('Request already accepted by another NGO');
  });

  test('POST /api/requests/respond with DECLINE updates status and logs notification', async () => {
    // Broadcast new donation to test decline
    const newDon = await request(app).post('/api/donations').send({ food_name: '30 Meals', quantity: 30 });
    const donId = newDon.body.donation.id;

    await request(app).post('/api/requests/broadcast').send({ donationId: donId, selectedNgoIds: ['ngo_3'] });
    const ngoReqs = await request(app).get('/api/ngos/ngo_3/requests');
    const targetReq = ngoReqs.body.requests.find(r => r.donation_id === donId);

    const res = await request(app)
      .post('/api/requests/respond')
      .send({
        requestId: targetReq.id,
        ngoId: 'ngo_3',
        action: 'DECLINE'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('DECLINED');
    expect(res.body.notification).toContain('NGO');
    expect(res.body.notification).toContain('declined the request');
  });
});
