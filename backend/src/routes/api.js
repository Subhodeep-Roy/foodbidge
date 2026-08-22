const express = require('express');
const router = express.Router();
const {
  getNgos,
  createNgo,
  getDonations,
  createDonation,
  getRecommendation,
  broadcastRequest,
  getNgoRequests,
  respondToRequest,
  getDonationBroadcastStatus,
  getHistory,
  deleteHistoryLog,
  getImpact
} = require('../controllers/donationController');

// REST API Endpoints
router.get('/ngos', getNgos);
router.post('/ngos', createNgo);
router.get('/donations', getDonations);
router.post('/donations', createDonation);
router.get('/donations/:id/recommendation', getRecommendation);
router.post('/requests/broadcast', broadcastRequest);
router.get('/ngos/:ngoId/requests', getNgoRequests);
router.post('/requests/respond', respondToRequest);
router.get('/donations/:id/status', getDonationBroadcastStatus);
router.get('/history', getHistory);
router.delete('/history/:id', deleteHistoryLog);
router.get('/impact', getImpact);

module.exports = router;
