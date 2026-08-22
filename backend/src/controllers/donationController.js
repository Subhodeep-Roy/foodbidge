const fs = require('fs');
const path = require('path');
const { executeNgoMatchingSkill, calculateFoodUrgency } = require('../services/matchingService');

const DATA_FILE = path.join(__dirname, '../../data/store.json');

// Default initial data seed
let defaultNgos = [
  {
    id: 'ngo_1',
    organization_name: 'Hope Foundation Shelter',
    address: '12 MG Road, Indiranagar',
    latitude: 12.9784,
    longitude: 77.6408,
    capacity: 120,
    demand: 80,
    verified: true
  },
  {
    id: 'ngo_2',
    organization_name: 'Care & Share Shelter',
    address: '45 Koramangala 5th Block',
    latitude: 12.9352,
    longitude: 77.6245,
    capacity: 200,
    demand: 150,
    verified: true
  },
  {
    id: 'ngo_3',
    organization_name: 'City Bread & Food Bank',
    address: '88 Jayanagar 4th Block',
    latitude: 12.9250,
    longitude: 77.5938,
    capacity: 150,
    demand: 110,
    verified: true
  }
];

let defaultDonations = [
  {
    id: 'don_1',
    supplier_id: 'sup_1',
    supplier_name: 'Grand Horizon Restaurant',
    food_name: '100 Vegetarian Meals',
    quantity: 100,
    food_type: 'VEGETARIAN',
    prepared_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    usable_hours: 5,
    latitude: 12.9716,
    longitude: 77.5946,
    status: 'AVAILABLE',
    accepted_by_ngo_id: null,
    accepted_by_ngo_name: null,
    created_at: new Date().toISOString()
  }
];

let defaultRequests = [
  {
    id: 'req_init_1',
    donation_id: 'don_1',
    supplier_name: 'Grand Horizon Restaurant',
    food_name: '100 Vegetarian Meals',
    quantity: 100,
    food_type: 'VEGETARIAN',
    usable_hours: 5,
    prepared_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ngo_id: 'ngo_1',
    ngo_name: 'Hope Foundation Shelter',
    status: 'PENDING',
    requested_at: new Date().toISOString()
  },
  {
    id: 'req_init_2',
    donation_id: 'don_1',
    supplier_name: 'Grand Horizon Restaurant',
    food_name: '100 Vegetarian Meals',
    quantity: 100,
    food_type: 'VEGETARIAN',
    usable_hours: 5,
    prepared_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ngo_id: 'ngo_2',
    ngo_name: 'Care & Share Shelter',
    status: 'PENDING',
    requested_at: new Date().toISOString()
  }
];

let defaultPickups = [];
let defaultImpact = {
  meals_rescued: 450,
  food_saved_kg: 189,
  co2_saved_kg: 340,
  pickups_completed: 12
};

let ngos = defaultNgos;
let donations = defaultDonations;
let donationRequests = defaultRequests;
let pickups = defaultPickups;
let impactStats = defaultImpact;

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      const data = JSON.parse(raw);
      if (data.ngos) ngos = data.ngos;
      if (data.donations) donations = data.donations;
      if (data.donationRequests) donationRequests = data.donationRequests;
      if (data.pickups) pickups = data.pickups;
      if (data.impactStats) impactStats = data.impactStats;
    } else {
      saveData();
    }
  } catch (err) {
    console.error('Error loading store.json:', err.message);
  }
}

function saveData() {
  try {
    const payload = {
      ngos,
      donations,
      donationRequests,
      pickups,
      impactStats,
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(payload, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving store.json:', err.message);
  }
}

loadData();

exports.getNgos = (req, res) => {
  loadData();
  res.json({ success: true, count: ngos.length, ngos });
};

exports.createNgo = (req, res) => {
  loadData();
  const {
    organization_name,
    address,
    capacity,
    demand,
    distance_km,
    doc_type,
    doc_id,
    doc_file_name
  } = req.body;

  if (!organization_name || !address) {
    return res.status(400).json({ success: false, message: 'organization_name and address are required' });
  }

  const newNgo = {
    id: `ngo_${Date.now()}`,
    organization_name,
    address,
    latitude: 12.9300 + (Math.random() - 0.5) * 0.05,
    longitude: 77.6100 + (Math.random() - 0.5) * 0.05,
    capacity: Number(capacity) || 100,
    demand: Number(demand) || 50,
    distanceKm: Number(distance_km) || 3.5,
    verified: true,
    doc_type: doc_type || '80G / 12A Certificate',
    doc_id: doc_id || `REG-${Math.floor(100000 + Math.random() * 900000)}`,
    doc_file_name: doc_file_name || 'Registration_Proof.pdf',
    created_at: new Date().toISOString()
  };

  ngos.unshift(newNgo);
  saveData();

  res.status(201).json({
    success: true,
    message: 'NGO Shelter registered successfully with verified documents',
    ngo: newNgo
  });
};

exports.getDonations = (req, res) => {
  loadData();
  res.json({ success: true, count: donations.length, donations });
};

exports.createDonation = (req, res) => {
  loadData();
  const { food_name, quantity, food_type, usable_hours, latitude, longitude, supplier_name } = req.body;

  if (!food_name || !quantity) {
    return res.status(400).json({ success: false, message: 'food_name and quantity are required' });
  }

  const newDonation = {
    id: `don_${Date.now()}`,
    supplier_id: 'sup_1',
    supplier_name: supplier_name || 'Grand Horizon Restaurant',
    food_name,
    quantity: Number(quantity),
    food_type: food_type || 'VEGETARIAN',
    prepared_at: new Date().toISOString(),
    usable_hours: Number(usable_hours) || 5,
    latitude: Number(latitude) || 12.9716,
    longitude: Number(longitude) || 77.5946,
    status: 'AVAILABLE',
    accepted_by_ngo_id: null,
    accepted_by_ngo_name: null,
    created_at: new Date().toISOString()
  };

  donations.unshift(newDonation);
  saveData();

  res.status(201).json({
    success: true,
    message: 'Donation registered successfully',
    donation: newDonation
  });
};

exports.getRecommendation = (req, res) => {
  loadData();
  const { id } = req.params;
  const donation = donations.find((d) => d.id === id) || donations[0];

  if (!donation) {
    return res.status(404).json({ success: false, message: 'Donation not found' });
  }

  const result = executeNgoMatchingSkill(donation, ngos);

  res.json({
    success: true,
    donationId: donation.id,
    ...result
  });
};

exports.broadcastRequest = (req, res) => {
  loadData();
  const { donationId, selectedNgoIds } = req.body;
  let donation = donations.find((d) => d.id === donationId);

  if (!donation) {
    donation = donations[0];
  }

  if (!Array.isArray(selectedNgoIds) || selectedNgoIds.length === 0) {
    return res.status(400).json({ success: false, message: 'Must select at least one NGO' });
  }

  const createdRequests = [];

  for (const ngoId of selectedNgoIds) {
    const ngo = ngos.find((n) => n.id === ngoId);
    if (!ngo) continue;

    let existing = donationRequests.find((r) => r.donation_id === donation.id && r.ngo_id === ngoId);
    if (!existing) {
      existing = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        donation_id: donation.id,
        supplier_name: donation.supplier_name,
        food_name: donation.food_name,
        quantity: donation.quantity,
        food_type: donation.food_type,
        usable_hours: donation.usable_hours,
        prepared_at: donation.prepared_at,
        ngo_id: ngoId,
        ngo_name: ngo.organization_name,
        status: 'PENDING',
        requested_at: new Date().toISOString()
      };
      donationRequests.unshift(existing);
    } else {
      existing.status = 'PENDING';
      existing.requested_at = new Date().toISOString();
    }
    createdRequests.push(existing);
  }

  donation.status = 'REQUEST_BROADCAST';
  saveData();

  res.json({
    success: true,
    message: `Requests successfully sent to ${createdRequests.length} selected NGO(s)`,
    donationId: donation.id,
    requests: createdRequests
  });
};

exports.getNgoRequests = (req, res) => {
  loadData();
  const { ngoId } = req.params;
  let requests = donationRequests.filter((r) => r.ngo_id === ngoId);

  if (requests.length === 0) {
    requests = donationRequests.filter((r) => r.status === 'PENDING' || r.ngo_id === ngoId);
  }

  res.json({ success: true, count: requests.length, requests });
};

exports.respondToRequest = (req, res) => {
  loadData();
  const { requestId, ngoId, action } = req.body;
  let request = donationRequests.find((r) => r.id === requestId);

  if (!request && ngoId) {
    request = donationRequests.find((r) => r.ngo_id === ngoId && r.status === 'PENDING');
  }

  if (!request) {
    const ngo = ngos.find((n) => n.id === ngoId) || ngos[0];
    const don = donations[0];
    request = {
      id: requestId || `req_${Date.now()}`,
      donation_id: don ? don.id : 'don_1',
      supplier_name: don ? don.supplier_name : 'Grand Horizon Restaurant',
      food_name: don ? don.food_name : '100 Vegetarian Meals',
      quantity: don ? don.quantity : 100,
      food_type: don ? don.food_type : 'VEGETARIAN',
      usable_hours: don ? don.usable_hours : 5,
      ngo_id: ngoId || 'ngo_1',
      ngo_name: ngo.organization_name,
      status: 'PENDING',
      requested_at: new Date().toISOString()
    };
    donationRequests.unshift(request);
  }

  const donation = donations.find((d) => d.id === request.donation_id) || donations[0];
  const ngo = ngos.find((n) => n.id === (ngoId || request.ngo_id)) || ngos[0];

  if (action === 'DECLINE') {
    request.status = 'DECLINED';
    request.responded_at = new Date().toISOString();
    saveData();
    return res.json({
      success: true,
      status: 'DECLINED',
      message: `You declined the request from ${request.supplier_name}`,
      notification: `NGO ${ngo.organization_name} has declined the request`
    });
  }

  if (action === 'ACCEPT') {
    if (donation && donation.status === 'MATCHED' && donation.accepted_by_ngo_id && donation.accepted_by_ngo_id !== (ngoId || request.ngo_id)) {
      request.status = 'EXPIRED_ACCEPTED_BY_OTHER';
      saveData();
      return res.status(409).json({
        success: false,
        code: 'ALREADY_ACCEPTED',
        message: 'Request already accepted by another NGO',
        acceptedByNgo: donation.accepted_by_ngo_name || 'Care & Share Shelter'
      });
    }

    request.status = 'ACCEPTED';
    request.responded_at = new Date().toISOString();
    if (donation) {
      donation.status = 'MATCHED';
      donation.accepted_by_ngo_id = ngo.id;
      donation.accepted_by_ngo_name = ngo.organization_name;
    }

    donationRequests.forEach((r) => {
      if (r.donation_id === request.donation_id && r.id !== request.id && r.status === 'PENDING') {
        r.status = 'EXPIRED_ACCEPTED_BY_OTHER';
      }
    });

    const deliveryPartners = [
      { name: 'Vikram Singh', id: 'FB-RIDER-104', vehicle: 'EV Cargo Bike' },
      { name: 'Rajesh Kumar', id: 'FB-RIDER-208', vehicle: 'Insulated Delivery Van' },
      { name: 'Amit Patel', id: 'FB-RIDER-312', vehicle: 'Temp-Controlled EV' },
      { name: 'Suresh Nair', id: 'FB-RIDER-405', vehicle: 'Express Cargo Scooter' }
    ];

    const foodbridgeAssistants = [
      { name: 'Priya Sharma', id: 'FBA-12', role: 'Food Safety Inspector' },
      { name: 'Ananya Deshmukh', id: 'FBA-27', role: 'Quality & Hygiene Auditor' },
      { name: 'Kavita Menon', id: 'FBA-09', role: 'Compliance Specialist' },
      { name: 'Rohan Mehta', id: 'FBA-33', role: 'Logistics Coordinator' }
    ];

    const partner = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)];
    const assistant = foodbridgeAssistants[Math.floor(Math.random() * foodbridgeAssistants.length)];

    const supplierEtaMins = Math.floor(Math.random() * 6) + 6; // 6 - 11 mins
    const ngoEtaMins = Math.floor(Math.random() * 8) + 10;     // 10 - 17 mins
    const totalEtaMins = supplierEtaMins + ngoEtaMins;

    const dispatchedAt = new Date().toISOString();
    const estimatedDeliveryAt = new Date(Date.now() + totalEtaMins * 60 * 1000).toISOString();

    request.status = 'ACCEPTED';
    request.responded_at = dispatchedAt;
    request.dispatched_at = dispatchedAt;
    request.estimated_delivery_at = estimatedDeliveryAt;

    request.delivery_partner_name = partner.name;
    request.delivery_partner_id = partner.id;
    request.delivery_vehicle = partner.vehicle;
    request.delivery_partner = `${partner.name} (${partner.id} - ${partner.vehicle})`;

    request.foodbridge_assistant_name = assistant.name;
    request.foodbridge_assistant_id = assistant.id;
    request.foodbridge_assistant_role = assistant.role;
    request.foodbridge_assistant = `${assistant.name} (${assistant.role} #${assistant.id})`;

    request.supplier_eta_mins = supplierEtaMins;
    request.ngo_eta_mins = ngoEtaMins;
    request.total_eta_mins = totalEtaMins;

    if (donation) {
      donation.status = 'MATCHED';
      donation.accepted_by_ngo_id = ngo.id;
      donation.accepted_by_ngo_name = ngo.organization_name;
    }

    donationRequests.forEach((r) => {
      if (r.donation_id === request.donation_id && r.id !== request.id && r.status === 'PENDING') {
        r.status = 'EXPIRED_ACCEPTED_BY_OTHER';
      }
    });

    const newPickup = {
      id: `pic_${Date.now()}`,
      donation_id: request.donation_id,
      ngo_id: ngo.id,
      ngo_name: ngo.organization_name,
      supplier_name: request.supplier_name,
      food_name: request.food_name,
      quantity: request.quantity,
      volunteer_name: partner.name,
      delivery_partner: request.delivery_partner,
      foodbridge_assistant: request.foodbridge_assistant,
      supplier_eta_mins: supplierEtaMins,
      ngo_eta_mins: ngoEtaMins,
      total_eta_mins: totalEtaMins,
      dispatched_at: dispatchedAt,
      estimated_delivery_at: estimatedDeliveryAt,
      status: 'SCHEDULED',
      created_at: dispatchedAt
    };
    pickups.unshift(newPickup);

    const rescuedQuantity = request.quantity || 100;
    const kgSaved = Math.round(rescuedQuantity * 0.42 * 10) / 10;
    const co2Saved = Math.round(kgSaved * 2.5 * 10) / 10;

    impactStats.meals_rescued += rescuedQuantity;
    impactStats.food_saved_kg += kgSaved;
    impactStats.co2_saved_kg += co2Saved;
    impactStats.pickups_completed += 1;

    saveData();

    return res.json({
      success: true,
      status: 'ACCEPTED',
      message: `Request accepted! Delivery Partner ${partner.name} and Assistant ${assistant.name} assigned for ${request.supplier_name}`,
      pickup: newPickup,
      request: request,
      impactUpdated: {
        mealsRescued: rescuedQuantity,
        kgSaved,
        co2Saved
      }
    });
  }

  res.status(400).json({ success: false, message: 'Invalid action. Use ACCEPT or DECLINE' });
};

// Helper function to enrich request items with default logistics if accepted
function enrichLogistics(request) {
  if (request.status === 'ACCEPTED') {
    if (!request.dispatched_at) {
      request.dispatched_at = request.responded_at || request.requested_at || new Date().toISOString();
    }
    if (!request.supplier_eta_mins) request.supplier_eta_mins = 8;
    if (!request.ngo_eta_mins) request.ngo_eta_mins = 14;
    if (!request.total_eta_mins) request.total_eta_mins = request.supplier_eta_mins + request.ngo_eta_mins;
    if (!request.estimated_delivery_at) {
      const d = new Date(request.dispatched_at);
      request.estimated_delivery_at = new Date(d.getTime() + request.total_eta_mins * 60 * 1000).toISOString();
    }
    if (!request.delivery_partner) {
      request.delivery_partner_name = 'Vikram Singh';
      request.delivery_partner_id = 'FB-RIDER-104';
      request.delivery_vehicle = 'EV Cargo Bike';
      request.delivery_partner = 'Vikram Singh (Rider #FB-104 - EV Cargo Bike)';
    }
    if (!request.foodbridge_assistant) {
      request.foodbridge_assistant_name = 'Priya Sharma';
      request.foodbridge_assistant_role = 'Food Safety Inspector';
      request.foodbridge_assistant = 'Priya Sharma (Food Safety Inspector #FBA-12)';
    }
  }
  return request;
}

// DELETE Specific History Request Log
exports.deleteHistoryLog = (req, res) => {
  loadData();
  const { id } = req.params;
  const initialLength = donationRequests.length;
  donationRequests = donationRequests.filter((r) => r.id !== id);

  saveData();

  res.json({
    success: true,
    message: `History entry ${id} deleted successfully`,
    deletedCount: initialLength - donationRequests.length
  });
};

exports.getDonationBroadcastStatus = (req, res) => {
  loadData();
  const { id } = req.params;
  const donation = donations.find((d) => d.id === id) || donations[0];
  let requests = donationRequests.filter((r) => r.donation_id === (donation ? donation.id : id));
  if (requests.length === 0) requests = donationRequests;

  requests = requests.map(enrichLogistics);

  res.json({
    success: true,
    donation,
    requests
  });
};

exports.getHistory = (req, res) => {
  loadData();
  const enrichedRequests = donationRequests.map(enrichLogistics);
  const accepted = enrichedRequests.filter((r) => r.status === 'ACCEPTED');
  const declined = enrichedRequests.filter((r) => r.status === 'DECLINED');
  const pending = enrichedRequests.filter((r) => r.status === 'PENDING');

  res.json({
    success: true,
    history: {
      total: enrichedRequests.length,
      accepted,
      declined,
      pending,
      pickups,
      donations
    }
  });
};


exports.getImpact = (req, res) => {
  loadData();
  res.json({ success: true, impact: impactStats });
};
