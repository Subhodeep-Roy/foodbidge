import React, { useState, useEffect, useRef } from 'react';
import {
  Utensils,
  ShieldCheck,
  Zap,
  MapPin,
  Truck,
  HeartHandshake,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  PlusCircle,
  Sparkles,
  ChevronRight,
  UserCheck,
  Building2,
  RefreshCw,
  XCircle,
  Send,
  CheckSquare,
  Square,
  LogOut,
  Bell,
  History,
  Layers,
  LayoutDashboard,
  Trash2,
  Calculator,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  ChevronDown,
  HelpCircle,
  Users,
  Compass,
  FileCheck,
  Upload,
  FileText,
  ArrowUpRight,
  Leaf,
  ArrowRight
} from 'lucide-react';

// Unified Date & Time Formatter for Both Portals
function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${dateStr} • ${timeStr}`;
}

// Real-Time Live Logistics & FoodBridge Assistant Tracking Component
function LiveLogisticsTracker({ log }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!log) return null;

  const dispatchedIso = log.dispatched_at || log.responded_at || log.timestamp || log.requested_at || new Date().toISOString();
  const dispatchedTime = new Date(dispatchedIso).getTime();

  const supplierEtaMins = log.supplier_eta_mins || 8;
  const ngoEtaMins = log.ngo_eta_mins || 14;
  const totalMins = log.total_eta_mins || (supplierEtaMins + ngoEtaMins);

  const supplierArrivalMs = dispatchedTime + supplierEtaMins * 60 * 1000;
  const ngoDeliveryMs = log.estimated_delivery_at ? new Date(log.estimated_delivery_at).getTime() : (dispatchedTime + totalMins * 60 * 1000);
  const estimatedDeliveryIso = log.estimated_delivery_at || new Date(ngoDeliveryMs).toISOString();

  const msToSupplier = Math.max(0, supplierArrivalMs - now);
  const msToNgo = Math.max(0, ngoDeliveryMs - now);

  const formatCountdown = (ms) => {
    if (ms <= 0) return '00m 00s (Arrived)';
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return `${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  // Compute live stage
  let stageIndex = 1;
  let stageLabel = 'Rider En Route to Supplier Kitchen';
  if (now > supplierArrivalMs && now < supplierArrivalMs + 2 * 60 * 1000) {
    stageIndex = 2;
    stageLabel = 'At Supplier Kitchen (Food Safety Inspection & Packaging)';
  } else if (now >= supplierArrivalMs + 2 * 60 * 1000 && now < ngoDeliveryMs) {
    stageIndex = 3;
    stageLabel = 'Food Picked Up • En Route to NGO Shelter';
  } else if (now >= ngoDeliveryMs) {
    stageIndex = 4;
    stageLabel = 'Delivered & Received by NGO Shelter';
  }

  const rider = log.delivery_partner || log.delivery_partner_name || 'Vikram Singh (Rider #FB-104 - EV Cargo Bike)';
  const assistant = log.foodbridge_assistant || 'Priya Sharma (Food Safety Inspector #FBA-12)';

  const dispatchedFormatted = formatDateTime(dispatchedIso);
  const estimatedDeliveryFormatted = formatDateTime(estimatedDeliveryIso);
  const dispatchedTimeOnly = new Date(dispatchedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const estDeliveryTimeOnly = new Date(ngoDeliveryMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="glass-panel"
      style={{
        padding: '1.75rem',
        marginBottom: '2rem',
        background: '#ffffff',
        border: '2px solid #059669',
        boxShadow: '0 10px 30px rgba(5, 150, 105, 0.12)',
        borderRadius: 'var(--radius-lg)'
      }}
    >
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="badge badge-success" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
              🚚 Real-Time Logistics Tracking
            </span>
            <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '800' }}>
              ● LIVE REAL-TIME ETA
            </span>
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#042f1a' }}>
            {log.quantity} {log.food_name}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            From <strong>{log.supplier_name || 'Supplier'}</strong> ➔ To <strong>{log.ngo_name || 'NGO Shelter'}</strong>
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Dispatched: {dispatchedFormatted}</span>
          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#047857' }}>
            Est. Delivery: {estimatedDeliveryFormatted}
          </span>
        </div>
      </div>

      {/* ASSIGNED PERSONNEL SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#f4fbf7', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <Truck style={{ width: '18px', height: '18px', color: '#047857' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase' }}>
              Assigned Delivery Partner
            </span>
          </div>
          <p style={{ fontWeight: '800', fontSize: '0.95rem', color: '#042f1a' }}>
            {rider}
          </p>
        </div>

        <div style={{ background: '#ecfdf5', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
            <ShieldCheck style={{ width: '18px', height: '18px', color: '#059669' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase' }}>
              FoodBridge Safety Assistant
            </span>
          </div>
          <p style={{ fontWeight: '800', fontSize: '0.95rem', color: '#042f1a' }}>
            {assistant}
          </p>
        </div>
      </div>

      {/* REAL-TIME COUNTDOWN ETAs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: stageIndex === 1 ? '#d1fae5' : '#ffffff', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase' }}>
            Time to Reach Supplier Kitchen
          </span>
          <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#047857', marginTop: '0.2rem' }}>
            {supplierEtaMins} Mins <span style={{ fontSize: '1rem', fontWeight: '700', color: '#059669' }}>({formatCountdown(msToSupplier)})</span>
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Rider Transit to Kitchen</span>
        </div>

        <div style={{ background: stageIndex === 3 ? '#ccfbf1' : '#ffffff', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(13, 148, 136, 0.3)', textAlign: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0f766e', textTransform: 'uppercase' }}>
            Time to Deliver to NGO Shelter
          </span>
          <p style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f766e', marginTop: '0.2rem' }}>
            {ngoEtaMins} Mins <span style={{ fontSize: '1rem', fontWeight: '700', color: '#0d9488' }}>({formatCountdown(msToNgo)})</span>
          </p>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Kitchen to Shelter Transit</span>
        </div>
      </div>

      {/* PROGRESS TRACKER BAR */}
      <div style={{ background: '#f4fbf7', padding: '1.1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '800', color: '#042f1a' }}>
          <span>1. Dispatched ({dispatchedTimeOnly})</span>
          <span>2. At Supplier ({supplierEtaMins}m)</span>
          <span>3. In Transit ({ngoEtaMins}m)</span>
          <span>4. Received by NGO ({estDeliveryTimeOnly})</span>
        </div>

        <div style={{ width: '100%', height: '10px', background: '#e5e7eb', borderRadius: '5px', overflow: 'hidden', position: 'relative' }}>
          <div
            style={{
              height: '100%',
              width: stageIndex === 1 ? '30%' : stageIndex === 2 ? '55%' : stageIndex === 3 ? '80%' : '100%',
              background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
        <p style={{ fontSize: '0.825rem', color: '#047857', fontWeight: '800', marginTop: '0.6rem', textAlign: 'center' }}>
          Current Status: {stageLabel}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  // Navigation & Role State
  const [userRole, setUserRole] = useState(null); // null (Home), 'supplier', 'ngo'
  const [selectedNgoUser, setSelectedNgoUser] = useState('ngo_101');
  const [selectedSupplierUser, setSelectedSupplierUser] = useState('sup_1');

  // Live Registered Restaurants / Food Suppliers List
  const [suppliersList, setSuppliersList] = useState([
    { id: 'sup_1', name: 'Grand Horizon Restaurant', address: '12 MG Road, Indiranagar, Bengaluru', food_type_specialty: 'Multicuisine & Buffet', contact_phone: '+91 98765 43210', verified: true },
    { id: 'sup_2', name: 'Royal Feast Catering Services', address: '45 Koramangala 5th Block, Bengaluru', food_type_specialty: 'Banquet & Event Meals', contact_phone: '+91 98123 45678', verified: true },
    { id: 'sup_3', name: 'Green Leaf Bakery & Bistro', address: '88 Jayanagar 4th Block, Bengaluru', food_type_specialty: 'Baked Goods & Fresh Produce', contact_phone: '+91 97654 32109', verified: true },
    { id: 'sup_4', name: 'Spice Garden Commercial Kitchen', address: '15 Whitefield Main Rd, Bengaluru', food_type_specialty: 'South Indian & Vegetarian Meals', contact_phone: '+91 96543 21098', verified: true }
  ]);

  const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
  const [newSupplierData, setNewSupplierData] = useState({
    name: '',
    address: '',
    food_type_specialty: 'Multicuisine & Buffet',
    contact_phone: ''
  });

  const currentSupplier = suppliersList.find((s) => s.id === selectedSupplierUser) || suppliersList[0] || {
    id: 'sup_1',
    name: 'Grand Horizon Restaurant',
    address: '12 MG Road, Indiranagar, Bengaluru'
  };
  const supplierName = currentSupplier.name;

  // Authentication & Portal Login View State
  const [authView, setAuthView] = useState(null); // null, 'supplier_login', 'ngo_login'
  const [loginSelectedSupplier, setLoginSelectedSupplier] = useState('sup_1');
  const [loginSelectedNgo, setLoginSelectedNgo] = useState('ngo_101');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [showPasswordText, setShowPasswordText] = useState(false);

  // Navigation Tab & Flow State
  const [activeTab, setActiveTab] = useState('main'); // 'main', 'ngos'
  const [flowStep, setFlowStep] = useState('dashboard'); // 'dashboard', 'create', 'analyzing', 'recommended', 'broadcast_sent'
  const [supplierSubTab, setSupplierSubTab] = useState('create'); // 'create', 'history'
  const [ngoSubTab, setNgoSubTab] = useState('requests'); // 'requests', 'history'

  // Header Single Login Dropdown State & Click-Outside Ref
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const loginMenuRef = useRef(null);

  // Live Registered NGOs List from Backend
  const [ngoList, setNgoList] = useState([
    { id: 'ngo_101', organization_name: 'Akshaya Patra Community Shelter', address: '15 Rajajinagar Industrial Area', capacity: 350, demand: 280, distanceKm: 3.2, doc_type: '80G / 12A Certificate', doc_id: 'REG-102948', doc_file_name: 'AkshayaPatra_80G.pdf', verified: true },
    { id: 'ngo_102', organization_name: 'Aashraya Children & Women Shelter', address: '72 HSR Layout Sector 1', capacity: 160, demand: 130, distanceKm: 4.1, doc_type: 'FSSAI License', doc_id: 'FSSAI-1102938', doc_file_name: 'Aashraya_FSSAI_Lic.pdf', verified: true },
    { id: 'ngo_103', organization_name: 'Robin Hood Army Distribution Center', address: '29 Commercial Street, Tasker Town', capacity: 250, demand: 210, distanceKm: 2.1, doc_type: 'NGO Darpan ID', doc_id: 'DARPAN-KA-4412', doc_file_name: 'RobinHood_Darpan_Reg.pdf', verified: true },
    { id: 'ngo_1', organization_name: 'Hope Foundation Shelter', address: '12 MG Road, Indiranagar', capacity: 120, demand: 80, distanceKm: 2.4, doc_type: '80G / 12A Certificate', doc_id: 'REG-882910', doc_file_name: 'Hope_Foundation_80G.pdf', verified: true },
    { id: 'ngo_2', organization_name: 'Care & Share Shelter', address: '45 Koramangala 5th Block', capacity: 200, demand: 150, distanceKm: 5.1, doc_type: 'FSSAI License', doc_id: 'FSSAI-2201948', doc_file_name: 'CareShare_FSSAI_Lic.pdf', verified: true },
    { id: 'ngo_3', organization_name: 'City Bread & Food Bank', address: '88 Jayanagar 4th Block', capacity: 150, demand: 110, distanceKm: 7.8, doc_type: 'NGO Darpan ID', doc_id: 'DARPAN-KA-9921', doc_file_name: 'CityBread_Darpan_ID.pdf', verified: true }
  ]);

  // NGO Registration Modal / Form State
  const [showAddNgoForm, setShowAddNgoForm] = useState(false);
  const [newNgoData, setNewNgoData] = useState({
    organization_name: '',
    address: '',
    capacity: 100,
    demand: 50,
    distance_km: 3.5,
    doc_type: '80G / 12A Certificate',
    doc_id: '',
    doc_file_name: ''
  });

  // Impact metrics
  const [impact, setImpact] = useState({
    meals_rescued: 450,
    food_saved_kg: 189.0,
    co2_saved_kg: 340.2,
    pickups_completed: 12
  });

  // Interactive Calculator State for Home Page
  const [calcMeals, setCalcMeals] = useState(150);

  // Persisted History Store from Backend
  const [historyLogs, setHistoryLogs] = useState([]);

  // Current donation creation form state (dynamic user input)
  const [formData, setFormData] = useState({
    food_name: '',
    quantity: 50,
    food_type: 'VEGETARIAN',
    usable_hours: 4
  });

  // Active donation & analysis state
  const [activeDonationId, setActiveDonationId] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Multi-NGO Selection state for Supplier
  const [selectedNgoIds, setSelectedNgoIds] = useState([]);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [broadcastStatus, setBroadcastStatus] = useState([]);

  // NGO Incoming Requests state
  const [ngoRequests, getNgoRequests] = useState([]);
  const [ngoNotification, setNgoNotification] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dismissedDeclinedIds, setDismissedDeclinedIds] = useState([]);

  // Click-Outside Handler to close Login Menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (loginMenuRef.current && !loginMenuRef.current.contains(event.target)) {
        setShowLoginMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch initial impact stats, history, live NGOs & suppliers list on mount
  useEffect(() => {
    fetchImpact();
    fetchHistory();
    fetchNgoList();
    fetchSupplierList();
    const interval = setInterval(() => {
      fetchHistory();
      fetchNgoList();
      fetchSupplierList();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (userRole === 'ngo') {
      fetchNgoRequests();
      const interval = setInterval(fetchNgoRequests, 2000);
      return () => clearInterval(interval);
    }
  }, [userRole, selectedNgoUser]);

  useEffect(() => {
    if (userRole === 'supplier') {
      fetchHistory();
      if (activeDonationId) fetchBroadcastStatus();
      const interval = setInterval(() => {
        fetchHistory();
        if (activeDonationId) fetchBroadcastStatus();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [userRole, selectedSupplierUser, activeDonationId]);

  const fetchNgoList = () => {
    fetch('/api/ngos')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ngos && data.ngos.length > 0) {
          setNgoList(data.ngos);
          if (!data.ngos.some((n) => n.id === selectedNgoUser)) {
            setSelectedNgoUser(data.ngos[0].id);
          }
        }
      })
      .catch(() => {});
  };

  const fetchSupplierList = () => {
    fetch('/api/suppliers')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.suppliers && data.suppliers.length > 0) {
          setSuppliersList(data.suppliers);
          if (!data.suppliers.some((s) => s.id === selectedSupplierUser)) {
            setSelectedSupplierUser(data.suppliers[0].id);
          }
        }
      })
      .catch(() => {});
  };

  const fetchImpact = () => {
    fetch('/api/impact')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.impact) setImpact(data.impact);
      })
      .catch(() => {});
  };

  const fetchHistory = () => {
    fetch('/api/history')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.history) {
          const accepted = data.history.accepted || [];
          const declined = data.history.declined || [];
          const pending = data.history.pending || [];

          const combined = [
            ...accepted.map((item) => ({ ...item, type: 'ACCEPTED', timestamp: item.responded_at || item.requested_at })),
            ...declined.map((item) => ({ ...item, type: 'DECLINED', timestamp: item.responded_at || item.requested_at })),
            ...pending.map((item) => ({ ...item, type: 'PENDING', timestamp: item.requested_at }))
          ];

          combined.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
          setHistoryLogs(combined);
        }
      })
      .catch(() => {});
  };

  // Register New Restaurant / Food Supplier
  const handleRegisterSupplierSubmit = (e) => {
    if (e) e.preventDefault();
    if (!newSupplierData.name || !newSupplierData.address) {
      alert('Please fill in Restaurant/Supplier Name and Address.');
      return;
    }
    setIsSubmitting(true);
    fetch('/api/suppliers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSupplierData)
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSubmitting(false);
        if (data.success && data.supplier) {
          setSuppliersList((prev) => [data.supplier, ...prev]);
          setSelectedSupplierUser(data.supplier.id);
          setNewSupplierData({
            name: '',
            address: '',
            food_type_specialty: 'Multicuisine & Buffet',
            contact_phone: ''
          });
          setShowAddSupplierForm(false);
          alert(`✅ Restaurant "${data.supplier.name}" registered successfully!`);
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        const newSup = {
          id: `sup_${Date.now()}`,
          ...newSupplierData,
          verified: true
        };
        setSuppliersList((prev) => [newSup, ...prev]);
        setSelectedSupplierUser(newSup.id);
        setShowAddSupplierForm(false);
        alert(`✅ Restaurant "${newSup.name}" registered successfully!`);
      });
  };

  // Register New NGO Shelter with Verified Required Documents
  const handleRegisterNgoSubmit = (e) => {
    if (e) e.preventDefault();
    if (!newNgoData.organization_name || !newNgoData.address) {
      alert('Organization name and address are required');
      return;
    }

    setIsSubmitting(true);
    fetch('/api/ngos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNgoData)
    })
      .then((res) => res.json())
      .then((data) => {
        setIsSubmitting(false);
        if (data.success && data.ngo) {
          setNgoList((prev) => [data.ngo, ...prev]);
          setSelectedNgoUser(data.ngo.id);
          setShowAddNgoForm(false);
          setNewNgoData({
            organization_name: '',
            address: '',
            capacity: 100,
            demand: 50,
            distance_km: 3.5,
            doc_type: '80G / 12A Certificate',
            doc_id: '',
            doc_file_name: ''
          });
          alert('🎉 NGO Shelter Registered Successfully with Verified Required Documents!');
          fetchNgoList();
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        const fallbackNgo = {
          id: `ngo_${Date.now()}`,
          organization_name: newNgoData.organization_name,
          address: newNgoData.address,
          capacity: Number(newNgoData.capacity),
          demand: Number(newNgoData.demand),
          distanceKm: Number(newNgoData.distance_km),
          doc_type: newNgoData.doc_type,
          doc_id: newNgoData.doc_id || `REG-${Math.floor(100000 + Math.random() * 900000)}`,
          doc_file_name: newNgoData.doc_file_name || `${newNgoData.organization_name.replace(/\s+/g, '_')}_Doc.pdf`,
          verified: true
        };
        setNgoList((prev) => [fallbackNgo, ...prev]);
        setSelectedNgoUser(fallbackNgo.id);
        setShowAddNgoForm(false);
      });
  };

  // Delete a specific history log entry
  const handleDeleteHistoryLog = (id, e) => {
    if (e) e.stopPropagation();
    fetch(`/api/history/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHistoryLogs((prev) => prev.filter((item) => item.id !== id));
          fetchHistory();
        }
      })
      .catch(() => {
        setHistoryLogs((prev) => prev.filter((item) => item.id !== id));
      });
  };

  const fetchNgoRequests = () => {
    fetch(`/api/ngos/${selectedNgoUser}/requests`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.requests) {
          getNgoRequests(data.requests);
        }
      })
      .catch(() => {});
  };

  const fetchBroadcastStatus = () => {
    if (!activeDonationId) return;
    fetch(`/api/donations/${activeDonationId}/status`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.requests) {
          setBroadcastStatus(data.requests);
        }
      })
      .catch(() => {});
  };

  const handleStartAnalysis = (e) => {
    if (e) e.preventDefault();
    if (!formData.food_name || !formData.quantity) {
      alert('Please provide food name and quantity.');
      return;
    }

    setIsSubmitting(true);
    setFlowStep('analyzing');

    setTimeout(() => {
      fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          supplier_name: supplierName,
          supplier_id: currentSupplier.id
        })
      })
        .then((res) => res.json())
        .then((data) => {
          const donId = data.donation ? data.donation.id : `don_${Date.now()}`;
          setActiveDonationId(donId);
          return fetch(`/api/donations/${donId}/recommendation`);
        })
        .then((res) => res.json())
        .then((recData) => {
          setAnalysisResult(recData);
          const recId = recData.recommendedNgo ? recData.recommendedNgo.id : 'ngo_1';
          const altIds = (recData.alternativeNgos || []).map((n) => n.id);
          setSelectedNgoIds([recId, ...altIds]);
          setIsSubmitting(false);
          setFlowStep('recommended');
        })
        .catch(() => {
          const fallbackRec = {
            donationId: `don_${Date.now()}`,
            donationAnalysis: {
              foodName: formData.food_name,
              quantity: formData.quantity,
              urgencyLevel: 'HIGH',
              urgencyScore: 88,
              remainingUsableTime: `${formData.usable_hours} hours`
            },
            recommendedNgo: {
              id: 'ngo_1',
              name: 'Hope Foundation Shelter',
              matchScore: 94,
              distanceKm: 2.4,
              demand: 80,
              capacity: 120,
              rationale: [
                '✓ High active meal demand',
                '✓ Nearby location (2.4 km distance)',
                '✓ Storage capacity available',
                '✓ Verified NGO organization'
              ]
            },
            alternativeNgos: [
              {
                id: 'ngo_2',
                name: 'Care & Share Shelter',
                matchScore: 81,
                distanceKm: 5.1,
                demand: 150,
                capacity: 200
              },
              {
                id: 'ngo_3',
                name: 'City Bread & Food Bank',
                matchScore: 75,
                distanceKm: 7.8,
                demand: 110,
                capacity: 150
              }
            ]
          };
          setAnalysisResult(fallbackRec);
          setSelectedNgoIds(['ngo_1', 'ngo_2', 'ngo_3']);
          setIsSubmitting(false);
          setFlowStep('recommended');
        });
    }, 1800);
  };

  const toggleNgoSelection = (id) => {
    if (selectedNgoIds.includes(id)) {
      setSelectedNgoIds(selectedNgoIds.filter((item) => item !== id));
    } else {
      setSelectedNgoIds([...selectedNgoIds, id]);
    }
  };

  const handleBroadcastRequests = () => {
    if (selectedNgoIds.length === 0) {
      alert('Please select at least one NGO to send request');
      return;
    }
    setIsSubmitting(true);

    fetch('/api/requests/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        donationId: activeDonationId || 'don_1',
        selectedNgoIds: selectedNgoIds
      })
    })
      .then((res) => res.json())
      .then((data) => {
        setBroadcastSent(true);
        if (data.requests) setBroadcastStatus(data.requests);
        fetchHistory();
        setIsSubmitting(false);
        setFlowStep('broadcast_sent');
      })
      .catch(() => {
        setBroadcastSent(true);
        setIsSubmitting(false);
        setFlowStep('broadcast_sent');
      });
  };

  const handleNgoResponse = (requestId, action) => {
    setIsSubmitting(true);
    setNgoNotification(null);

    fetch('/api/requests/respond', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        ngoId: selectedNgoUser,
        action
      })
    })
      .then(async (res) => {
        const data = await res.json();
        setIsSubmitting(false);

        if (!res.ok) {
          if (data.code === 'ALREADY_ACCEPTED') {
            setNgoNotification({
              type: 'error',
              title: 'Request Conflict!',
              message: `⚠️ Request already accepted by another NGO (${data.acceptedByNgo || 'Care & Share Shelter'})`
            });
          } else {
            setNgoNotification({
              type: 'error',
              title: 'Error',
              message: data.message || 'Could not process request'
            });
          }
          fetchNgoRequests();
          fetchHistory();
          return;
        }

        if (action === 'ACCEPT') {
          setNgoNotification({
            type: 'success',
            title: 'Request Accepted & Volunteer Dispatched!',
            message: `🎉 ${data.message}`
          });
          fetchImpact();
        } else {
          setNgoNotification({
            type: 'info',
            title: 'Request Declined',
            message: 'You have declined this donation request.'
          });
        }
        fetchNgoRequests();
        fetchHistory();
      })
      .catch((err) => {
        setIsSubmitting(false);
        fetchNgoRequests();
        fetchHistory();
      });
  };

  const activeNgoObj = ngoList.find((n) => n.id === selectedNgoUser);
  const currentNgoName = activeNgoObj
    ? (activeNgoObj.organization_name || activeNgoObj.name)
    : 'Akshaya Patra Community Shelter';

  const handleLogout = () => {
    setUserRole(null);
    setAuthView(null);
    setActiveTab('main');
    setFlowStep('dashboard');
    setAnalysisResult(null);
    setNgoNotification(null);
    setShowLoginMenu(false);
    setPasswordError(null);
    setPasswordInput('');
  };

  const openSupplierLogin = () => {
    setActiveTab('main');
    setAuthView('supplier_login');
    setLoginSelectedSupplier(selectedSupplierUser || 'sup_1');
    setPasswordInput('');
    setPasswordError(null);
    setShowLoginMenu(false);
  };

  const openNgoLogin = () => {
    setActiveTab('main');
    setAuthView('ngo_login');
    setLoginSelectedNgo(selectedNgoUser || 'ngo_101');
    setPasswordInput('');
    setPasswordError(null);
    setShowLoginMenu(false);
  };

  const handleSupplierLoginSubmit = (e) => {
    if (e) e.preventDefault();
    if (passwordInput === '1234') {
      setSelectedSupplierUser(loginSelectedSupplier);
      setUserRole('supplier');
      setActiveTab('main');
      setFlowStep('dashboard');
      setSupplierSubTab('create');
      setAuthView(null);
      setPasswordError(null);
      setPasswordInput('');
    } else {
      setPasswordError('❌ Invalid password! Default portal password is 1234.');
    }
  };

  const handleNgoLoginSubmit = (e) => {
    if (e) e.preventDefault();
    if (passwordInput === '1234') {
      setSelectedNgoUser(loginSelectedNgo);
      setUserRole('ngo');
      setActiveTab('main');
      setFlowStep('dashboard');
      setNgoSubTab('requests');
      setAuthView(null);
      setPasswordError(null);
      setPasswordInput('');
    } else {
      setPasswordError('❌ Invalid password! Default portal password is 1234.');
    }
  };

  const isLogActiveInTransit = (l) => {
    if (!l || l.type !== 'ACCEPTED') return false;
    if (l.status === 'DELIVERED' || l.delivered === true) return false;
    const dispatchedTime = new Date(l.dispatched_at || l.timestamp || l.requested_at).getTime();
    const totalEtaMins = l.total_eta_mins || 22;
    const ngoDeliveryMs = l.estimated_delivery_at
      ? new Date(l.estimated_delivery_at).getTime()
      : dispatchedTime + totalEtaMins * 60 * 1000;
    return Date.now() < ngoDeliveryMs;
  };

  const activeAcceptedLogs = historyLogs.filter(
    (l) => isLogActiveInTransit(l) && (l.supplier_id === selectedSupplierUser || l.supplier_name === supplierName)
  );
  const activeNgoAcceptedLogs = historyLogs.filter((l) => l.ngo_id === selectedNgoUser && isLogActiveInTransit(l));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Light Theme Navbar Header */}
      <header className="header-wrapper">
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo-container" onClick={handleLogout}>
            <div className="header-logo-icon">
              <Leaf style={{ color: '#fff', width: '22px', height: '22px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span className="header-logo-title">
                  Food<span className="gradient-text">Bridge</span>
                </span>
                <span className="badge badge-success header-logo-badge" style={{ fontSize: '0.65rem' }}>
                  Editorial Edition v16.0
                </span>
              </div>
              <p className="header-logo-subtitle">
                Surplus Rescue & AI NGO Matching Platform
              </p>
            </div>
          </div>

          {/* Header Controls: Navigation Tabs FIRST, LOGIN AT THE FAR RIGHT */}
          <div className="header-controls">
            {/* AUXILIARY NAVIGATION TABS */}
            <nav style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                onClick={() => {
                  setActiveTab('ngos');
                  setAuthView(null);
                }}
                className={`header-nav-btn ${activeTab === 'ngos' && !authView ? 'btn-primary' : 'btn-secondary'}`}
              >
                NGO signed
              </button>
            </nav>

            {/* EXTREME MOST RIGHT SIDE LOGIN BUTTON WITH CLICK-OUTSIDE DISMISSABLE DROPDOWN */}
            <div style={{ position: 'relative' }} ref={loginMenuRef}>
              <button
                onClick={() => setShowLoginMenu(!showLoginMenu)}
                className="btn-primary header-login-btn"
              >
                <LogIn style={{ width: '15px', height: '15px' }} />
                <span>
                  {userRole === 'supplier'
                    ? `🍽️ ${supplierName}`
                    : userRole === 'ngo'
                    ? `🏢 ${currentNgoName}`
                    : `🔒 Portal Login`}
                </span>
                <ChevronDown style={{ width: '15px', height: '15px', marginLeft: '0.1rem' }} />
              </button>

              {/* DROPDOWN MENU FOR THE EXTREME RIGHT LOGIN BUTTON */}
              {showLoginMenu && (
                <div className="header-dropdown-menu">
                  <p style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', padding: '0.4rem 0.6rem 0.2rem', textTransform: 'uppercase' }}>
                    Select Portal Persona
                  </p>

                  <button
                    onClick={openSupplierLogin}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: userRole === 'supplier' ? '#d1fae5' : 'transparent',
                      color: '#042f1a',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}
                  >
                    <Utensils style={{ color: '#047857', width: '18px', height: '18px' }} /> Food Supplier Portal
                  </button>

                  <button
                    onClick={openNgoLogin}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: userRole === 'ngo' ? '#ccfbf1' : 'transparent',
                      color: '#042f1a',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem'
                    }}
                  >
                    <Building2 style={{ color: '#0f766e', width: '18px', height: '18px' }} /> NGO Shelter Portal
                  </button>

                  {userRole && (
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '0.2rem', paddingTop: '0.35rem' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          color: '#be123c',
                          fontWeight: '600',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem'
                        }}
                      >
                        <LogOut style={{ width: '16px', height: '16px' }} /> Return Home / Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: 'clamp(1.25rem, 3vw, 2.5rem) clamp(0.75rem, 3vw, 1.5rem)' }}>
        {/* SUPPLIER LOGIN PAGE */}
        {authView === 'supplier_login' && (
          <div style={{ maxWidth: '520px', width: '100%', margin: 'clamp(1rem, 3vw, 2rem) auto' }}>
            <div
              className="glass-panel"
              style={{
                padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.2rem, 3vw, 2rem)',
                background: '#ffffff',
                border: '2px solid #059669',
                boxShadow: '0 20px 40px rgba(5, 150, 105, 0.12)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              {/* HEADER BADGE */}
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: '#d1fae5',
                    color: '#047857',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}
                >
                  <Utensils style={{ width: '32px', height: '32px' }} />
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#042f1a' }}>
                  Food Supplier Portal Login
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                  Select your registered restaurant establishment and enter portal password to login.
                </p>
              </div>

              {/* ERROR BANNER */}
              {passwordError && (
                <div
                  style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    color: '#be123c',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <AlertTriangle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleSupplierLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* SELECT REGISTERED RESTAURANT */}
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: '800', color: '#042f1a', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Registered Restaurant / Food Supplier *
                  </label>
                  <select
                    value={loginSelectedSupplier}
                    onChange={(e) => {
                      setLoginSelectedSupplier(e.target.value);
                      setPasswordError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--primary)',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      color: '#042f1a',
                      background: '#f4fbf7',
                      cursor: 'pointer'
                    }}
                  >
                    {suppliersList.map((sup) => (
                      <option key={sup.id} value={sup.id}>
                        🍽️ {sup.name}
                      </option>
                    ))}
                  </select>

                  {/* FULL ADDRESS DISPLAYED BELOW NAME WITHIN BRACKETS */}
                  {(() => {
                    const selSup = suppliersList.find((s) => s.id === loginSelectedSupplier) || suppliersList[0];
                    if (!selSup) return null;
                    return (
                      <div style={{ marginTop: '0.6rem', padding: '0.65rem 0.9rem', background: '#ecfdf5', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <div style={{ fontWeight: '800', color: '#042f1a', fontSize: '0.95rem' }}>
                          🍽️ {selSup.name}
                        </div>
                        <div style={{ color: '#047857', fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: '600', lineHeight: '1.4' }}>
                          ({selSup.address})
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* ENTER PASSWORD INPUT */}
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: '800', color: '#042f1a', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Portal Access Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      placeholder="XXXXXXXXX"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError(null);
                      }}
                      required
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '0.85rem 2.8rem 0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: passwordError ? '2px solid #be123c' : '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        letterSpacing: showPasswordText ? 'normal' : '0.15em'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                      style={{
                        position: 'absolute',
                        right: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPasswordText ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.4rem', fontWeight: '600' }}>
                    💡 Default access password for all registered restaurants is <strong>1234</strong>
                  </p>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.95rem',
                    fontSize: '1rem',
                    fontWeight: '800',
                    marginTop: '0.5rem',
                    boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  <LogIn style={{ width: '18px', height: '18px' }} /> Login to Supplier Portal
                </button>

                {/* BACK TO HOME */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthView(null);
                    setPasswordError(null);
                  }}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.875rem' }}
                >
                  <ArrowLeft style={{ width: '16px', height: '16px' }} /> Return to Main Home
                </button>
              </form>
            </div>
          </div>
        )}

        {/* NGO SHELTER LOGIN PAGE */}
        {authView === 'ngo_login' && (
          <div style={{ maxWidth: '520px', width: '100%', margin: 'clamp(1rem, 3vw, 2rem) auto' }}>
            <div
              className="glass-panel"
              style={{
                padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1.2rem, 3vw, 2rem)',
                background: '#ffffff',
                border: '2px solid #0f766e',
                boxShadow: '0 20px 40px rgba(15, 118, 110, 0.12)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              {/* HEADER BADGE */}
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '20px',
                    background: '#ccfbf1',
                    color: '#0f766e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}
                >
                  <Building2 style={{ width: '32px', height: '32px' }} />
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#042f1a' }}>
                  NGO Shelter Portal Login
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.35rem' }}>
                  Select your verified NGO shelter organization and enter portal password to login.
                </p>
              </div>

              {/* ERROR BANNER */}
              {passwordError && (
                <div
                  style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    color: '#be123c',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <AlertTriangle style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleNgoLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* SELECT VERIFIED NGO SHELTER */}
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: '800', color: '#042f1a', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Verified NGO Shelter *
                  </label>
                  <select
                    value={loginSelectedNgo}
                    onChange={(e) => {
                      setLoginSelectedNgo(e.target.value);
                      setPasswordError(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #0d9488',
                      fontSize: '0.95rem',
                      fontWeight: '700',
                      color: '#042f1a',
                      background: '#f0fdfa',
                      cursor: 'pointer'
                    }}
                  >
                    {ngoList.map((ngo) => (
                      <option key={ngo.id} value={ngo.id}>
                        🏢 {ngo.organization_name || ngo.name}
                      </option>
                    ))}
                  </select>

                  {/* FULL ADDRESS DISPLAYED BELOW NAME WITHIN BRACKETS */}
                  {(() => {
                    const selNgo = ngoList.find((n) => n.id === loginSelectedNgo) || ngoList[0];
                    if (!selNgo) return null;
                    const ngoName = selNgo.organization_name || selNgo.name;
                    return (
                      <div style={{ marginTop: '0.6rem', padding: '0.65rem 0.9rem', background: '#f0fdfa', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(13, 148, 136, 0.3)' }}>
                        <div style={{ fontWeight: '800', color: '#042f1a', fontSize: '0.95rem' }}>
                          🏢 {ngoName}
                        </div>
                        <div style={{ color: '#0f766e', fontSize: '0.85rem', marginTop: '0.25rem', fontWeight: '600', lineHeight: '1.4' }}>
                          ({selNgo.address})
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* ENTER PASSWORD INPUT */}
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: '800', color: '#042f1a', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                    Portal Access Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      placeholder="XXXXXXXXX"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        setPasswordError(null);
                      }}
                      required
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '0.85rem 2.8rem 0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: passwordError ? '2px solid #be123c' : '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        letterSpacing: showPasswordText ? 'normal' : '0.15em'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                      style={{
                        position: 'absolute',
                        right: '0.85rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {showPasswordText ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#0f766e', marginTop: '0.4rem', fontWeight: '600' }}>
                    💡 Default access password for all verified shelters is <strong>1234</strong>
                  </p>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    padding: '0.95rem',
                    fontSize: '1rem',
                    fontWeight: '800',
                    marginTop: '0.5rem',
                    background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                    boxShadow: '0 6px 20px rgba(13, 148, 136, 0.3)'
                  }}
                >
                  <LogIn style={{ width: '18px', height: '18px' }} /> Login to NGO Shelter Portal
                </button>

                {/* BACK TO HOME */}
                <button
                  type="button"
                  onClick={() => {
                    setAuthView(null);
                    setPasswordError(null);
                  }}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.875rem' }}
                >
                  <ArrowLeft style={{ width: '16px', height: '16px' }} /> Return to Main Home
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'main' && (
          <div>
            {/* HIGH-IMPACT MINIMALIST & EDITORIAL HOME LANDING PAGE DESIGN */}
            {!userRole && !authView && (
              <div style={{ maxWidth: '1120px', margin: '0 auto' }}>

                {/* 1. HIGH-IMPACT EDITORIAL HERO HEADER */}
                <div style={{ textAlign: 'center', padding: '1rem 0 3.5rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#d1fae5', color: '#047857', padding: '0.4rem 1.25rem', borderRadius: '30px', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                    ✦ ACCREDITED SURPLUS FOOD RESCUE PROTOCOL ✦
                  </div>

                  <h1 style={{ fontSize: '3.8rem', fontWeight: '900', lineHeight: '1.08', color: '#042f1a', letterSpacing: '-0.04em', maxWidth: '920px', margin: '0 auto' }}>
                    Zero Food Waste. <br/>
                    <span className="gradient-text">Direct to Local Shelters.</span>
                  </h1>

                  <p style={{ color: '#374151', fontSize: '1.2rem', maxWidth: '720px', margin: '1.25rem auto 0', lineHeight: '1.65', fontWeight: '450' }}>
                    FoodBridge connects restaurant & caterer surplus directly with verified shelters and community kitchens through real-time AI spoilage evaluation and volunteer dispatch.
                  </p>
                </div>

                {/* 2. MINIMALIST EDITORIAL METRIC STRIP */}
                <div
                  className="glass-panel"
                  style={{
                    padding: '1.75rem 2.5rem',
                    marginBottom: '4rem',
                    background: '#ffffff',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: 'var(--radius-xl)',
                    boxShadow: '0 12px 35px rgba(5, 150, 105, 0.06)'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                    <div>
                      <p style={{ fontSize: '2.2rem', fontWeight: '900', color: '#047857', letterSpacing: '-0.03em' }}>
                        {(impact?.meals_rescued || 450).toLocaleString()}+
                      </p>
                      <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.2rem' }}>
                        Meals Rescued
                      </p>
                    </div>

                    <div style={{ borderLeft: '1px solid rgba(0,0,0,0.06)', paddingLeft: '1rem' }}>
                      <p style={{ fontSize: '2.2rem', fontWeight: '900', color: '#059669', letterSpacing: '-0.03em' }}>
                        {Number(impact?.food_saved_kg || 189).toFixed(1)} kg
                      </p>
                      <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.2rem' }}>
                        Food Saved
                      </p>
                    </div>

                    <div style={{ borderLeft: '1px solid rgba(0,0,0,0.06)', paddingLeft: '1rem' }}>
                      <p style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0d9488', letterSpacing: '-0.03em' }}>
                        {Number(impact?.co2_saved_kg || 340).toFixed(2)} kg
                      </p>
                      <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.2rem' }}>
                        CO₂ Avoided
                      </p>
                    </div>

                    <div style={{ borderLeft: '1px solid rgba(0,0,0,0.06)', paddingLeft: '1rem' }}>
                      <p style={{ fontSize: '2.2rem', fontWeight: '900', color: '#d97706', letterSpacing: '-0.03em' }}>
                        {impact?.pickups_completed || 12}
                      </p>
                      <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '0.2rem' }}>
                        Completed Pickups
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. DUAL EDITORIAL PORTAL CARDS (FOOD SUPPLIER & NGO SHELTER) */}
                <div className="home-portals-grid">
                  {/* FOOD SUPPLIER PORTAL CARD */}
                  <div
                    className="glass-panel"
                    style={{
                      padding: '2.75rem 2.25rem',
                      background: '#ffffff',
                      border: '1.5px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: '0 12px 35px rgba(5, 150, 105, 0.07)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.25 ease'
                    }}
                    onClick={openSupplierLogin}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: '#d1fae5',
                            color: '#047857',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Utensils style={{ width: '28px', height: '28px' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#ecfdf5', color: '#047857', padding: '0.35rem 0.85rem', borderRadius: '20px', textTransform: 'uppercase' }}>
                          For Caterers & Messes
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#042f1a', marginBottom: '0.6rem' }}>
                        Food Supplier Portal
                      </h2>
                      <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.65', marginBottom: '1.75rem' }}>
                        Post excess kitchen preparation or packaged inventory. Instantly score spoilage window and trigger parallel NGO dispatch offers.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#042f1a', fontWeight: '600' }}>
                          <CheckCircle2 style={{ width: '18px', height: '18px', color: '#059669' }} /> AI Spoilage & Urgency Index Calculation
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#042f1a', fontWeight: '600' }}>
                          <CheckCircle2 style={{ width: '18px', height: '18px', color: '#059669' }} /> Multi-NGO Selection Checkbox Controls
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#042f1a', fontWeight: '600' }}>
                          <CheckCircle2 style={{ width: '18px', height: '18px', color: '#059669' }} /> Real-Time Persisted Audit Activity Stack
                        </div>
                      </div>
                    </div>

                    <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '1.05rem', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)' }}>
                      Enter Supplier Portal <ArrowRight style={{ width: '18px', height: '18px' }} />
                    </button>
                  </div>

                  {/* NGO SHELTER PORTAL CARD */}
                  <div
                    className="glass-panel"
                    style={{
                      padding: '2.75rem 2.25rem',
                      background: '#ffffff',
                      border: '1.5px solid rgba(13, 148, 136, 0.25)',
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: '0 12px 35px rgba(13, 148, 136, 0.07)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.25 ease'
                    }}
                    onClick={openNgoLogin}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: '#ccfbf1',
                            color: '#0f766e',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Building2 style={{ width: '28px', height: '28px' }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', background: '#f0fdf4', color: '#0f766e', padding: '0.35rem 0.85rem', borderRadius: '20px', textTransform: 'uppercase' }}>
                          For Verified Shelters
                        </span>
                      </div>

                      <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#042f1a', marginBottom: '0.6rem' }}>
                        NGO Shelter Portal
                      </h2>
                      <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.65', marginBottom: '1.75rem' }}>
                        Receive incoming surplus food offers from nearby establishments. Accept or decline offers with automated volunteer pickup dispatch.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#042f1a', fontWeight: '600' }}>
                          <CheckCircle2 style={{ width: '18px', height: '18px', color: '#0d9488' }} /> Incoming Food Request Dispatch Stack
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#042f1a', fontWeight: '600' }}>
                          <CheckCircle2 style={{ width: '18px', height: '18px', color: '#0d9488' }} /> Single-Acceptance Conflict Guarding
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#042f1a', fontWeight: '600' }}>
                          <CheckCircle2 style={{ width: '18px', height: '18px', color: '#0d9488' }} /> Dynamic Switcher for 19 Partner Shelters
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-primary"
                      style={{
                        width: '100%',
                        justifyContent: 'center',
                        fontSize: '1.05rem',
                        padding: '1rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)'
                      }}
                    >
                      Enter NGO Portal <ArrowRight style={{ width: '18px', height: '18px' }} />
                    </button>
                  </div>
                </div>

                {/* 4. EDITORIAL 3-STEP PROTOCOL EXPLANATION */}
                <div
                  className="glass-panel"
                  style={{
                    padding: '3rem 2.5rem',
                    marginBottom: '4rem',
                    background: '#ffffff',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Rescue Protocol Workflow
                    </span>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#042f1a', marginTop: '0.3rem' }}>
                      How FoodBridge Operates
                    </h2>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div style={{ borderLeft: '3px solid #059669', paddingLeft: '1.25rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(5, 150, 105, 0.25)', display: 'block', lineHeight: 1 }}>01</span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#042f1a', margin: '0.4rem 0 0.3rem' }}>
                        AI Spoilage & Urgency Analysis
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.6' }}>
                        Food items are evaluated for remaining safe consumption window, quantity, and preparation category.
                      </p>
                    </div>

                    <div style={{ borderLeft: '3px solid #0d9488', paddingLeft: '1.25rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(13, 148, 136, 0.25)', display: 'block', lineHeight: 1 }}>02</span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#042f1a', margin: '0.4rem 0 0.3rem' }}>
                        4-Vector NGO Match Ranking
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.6' }}>
                        Ranks candidate shelters based on demand ratio (40%), proximity (30%), capacity (20%), and urgency (10%).
                      </p>
                    </div>

                    <div style={{ borderLeft: '3px solid #d97706', paddingLeft: '1.25rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'rgba(217, 119, 6, 0.25)', display: 'block', lineHeight: 1 }}>03</span>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#042f1a', margin: '0.4rem 0 0.3rem' }}>
                        Volunteer Dispatch & Lock
                      </h3>
                      <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: '1.6' }}>
                        The first shelter to accept secures atomic pickup ownership, immediately dispatching a volunteer driver.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. ANONYMIZED NGO NETWORK OVERVIEW */}
                <section
                  className="glass-panel"
                  style={{
                    padding: '3rem 2.5rem',
                    marginBottom: '4rem',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <Building2 style={{ color: '#059669', width: '20px', height: '20px' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Verified Partner Network
                        </span>
                      </div>
                      <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#042f1a' }}>
                        Accredited Partner Organizations
                      </h2>
                    </div>

                    <button
                      onClick={() => setActiveTab('ngos')}
                      className="btn-primary"
                      style={{ padding: '0.75rem 1.4rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      View Verified NGO Directory <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ background: '#ffffff', padding: '1.5rem' }}>
                      <Utensils style={{ color: '#047857', width: '24px', height: '24px', marginBottom: '0.75rem' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#042f1a', marginBottom: '0.4rem' }}>
                        Community Kitchens
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
                        Providing prepared hot meals to daily wage workers and urban relief centers.
                      </p>
                    </div>

                    <div className="glass-card" style={{ background: '#ffffff', padding: '1.5rem' }}>
                      <Users style={{ color: '#0f766e', width: '24px', height: '24px', marginBottom: '0.75rem' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#042f1a', marginBottom: '0.4rem' }}>
                        Child & Women Welfare
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
                        Supplying fresh, safe meals to orphanages, after-school care, and maternity centers.
                      </p>
                    </div>

                    <div className="glass-card" style={{ background: '#ffffff', padding: '1.5rem' }}>
                      <Building2 style={{ color: '#b45309', width: '24px', height: '24px', marginBottom: '0.75rem' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#042f1a', marginBottom: '0.4rem' }}>
                        Emergency Shelters
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
                        Supporting night shelters and elder homes with daily surplus meal deliveries.
                      </p>
                    </div>

                    <div className="glass-card" style={{ background: '#ffffff', padding: '1.5rem' }}>
                      <FileCheck style={{ color: '#0369a1', width: '24px', height: '24px', marginBottom: '0.75rem' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#042f1a', marginBottom: '0.4rem' }}>
                        100% Document Verified
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: '1.5' }}>
                        Every shelter possesses verified 80G tax exemption, FSSAI licenses, or NGO Darpan registration.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 6. INTERACTIVE IMPACT ESTIMATOR SLIDER */}
                <div
                  className="glass-panel"
                  style={{
                    padding: '3rem 2.5rem',
                    marginBottom: '4rem',
                    background: '#ffffff',
                    border: '1px solid rgba(16, 185, 129, 0.25)'
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Interactive Estimator
                      </span>
                      <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#042f1a', margin: '0.3rem 0 0.5rem' }}>
                        Calculate Your Surplus Impact
                      </h2>
                      <p style={{ color: '#4b5563', fontSize: '0.925rem', marginBottom: '1.75rem', lineHeight: '1.6' }}>
                        Adjust the slider below to see how many meals, food mass, and greenhouse gas emissions your establishment can rescue.
                      </p>

                      <div style={{ background: '#f4fbf7', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: '800', color: '#042f1a', marginBottom: '0.75rem' }}>
                          <span>Surplus Meals Prepared:</span>
                          <span style={{ color: '#047857', fontSize: '1.25rem' }}>{calcMeals} Meals</span>
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="1000"
                          step="10"
                          value={calcMeals}
                          onChange={(e) => setCalcMeals(Number(e.target.value))}
                          style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                      <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem', background: '#f4fbf7' }}>
                        <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#047857' }}>{calcMeals}</p>
                        <p style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: '700', textTransform: 'uppercase', marginTop: '0.2rem' }}>Meals Provided</p>
                      </div>

                      <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem', background: '#ecfdf5' }}>
                        <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#059669' }}>{(calcMeals * 0.42).toFixed(1)} kg</p>
                        <p style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: '700', textTransform: 'uppercase', marginTop: '0.2rem' }}>Food Saved</p>
                      </div>

                      <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem', background: '#ccfbf1' }}>
                        <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0d9488' }}>{(calcMeals * 0.42 * 2.5).toFixed(2)} kg</p>
                        <p style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: '700', textTransform: 'uppercase', marginTop: '0.2rem' }}>CO₂ Avoided</p>
                      </div>

                      <div className="glass-card" style={{ textAlign: 'center', padding: '1.5rem', background: '#fef3c7' }}>
                        <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#d97706' }}>{Math.ceil(calcMeals / 3)}</p>
                        <p style={{ fontSize: '0.75rem', color: '#4b5563', fontWeight: '700', textTransform: 'uppercase', marginTop: '0.2rem' }}>Families Fed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7. CLEAN FAQ ACCORDION GRID */}
                <div className="glass-panel" style={{ padding: '3rem 2.5rem', background: '#ffffff', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#042f1a' }}>
                      Frequently Asked Questions
                    </h3>
                    <p style={{ color: '#4b5563', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                      Key information regarding safety protocols, NGO verification, and request dispatch.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.4rem', color: '#042f1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HelpCircle style={{ width: '18px', height: '18px', color: '#059669' }} /> How is food safety governed?
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.6' }}>
                        Our AI Rescue Agent enforces Rule 1 of `constitution.md`. Food items with safe window remaining under 1 hour are flagged for urgent consumption or declined.
                      </p>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.4rem', color: '#042f1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HelpCircle style={{ width: '18px', height: '18px', color: '#059669' }} /> What prevents double pickups?
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.6' }}>
                        The backend enforces strict atomic single-acceptance locking. The first NGO to accept secures the pickup; any subsequent attempt receives an instant `409 Conflict` notice.
                      </p>
                    </div>

                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.4rem', color: '#042f1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <HelpCircle style={{ width: '18px', height: '18px', color: '#059669' }} /> How does manual selection work?
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.6' }}>
                        Suppliers can review AI rankings and use checkboxes to broadcast donation requests to single or multiple candidate shelters at once.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FOOD SUPPLIER DASHBOARD WITH LEFT SIDEBAR NAVIGATION */}
            {userRole === 'supplier' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#042f1a' }}>
                      <LayoutDashboard style={{ color: 'var(--primary)' }} /> Food Supplier Dashboard — <span className="gradient-text">{supplierName}</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      Operational View: Create Surplus Food Offerings & Audit Persisted Activity Stack.
                    </p>
                  </div>
                </div>

                {/* LIVE DECLINED REQUEST NOTIFICATION BANNER FOR RESTAURANT DASHBOARD */}
                {(() => {
                  const currentDeclined = (historyLogs || []).filter(
                    (log) =>
                      log.type === 'DECLINED' &&
                      (log.supplier_id === selectedSupplierUser || log.supplier_name === supplierName) &&
                      !dismissedDeclinedIds.includes(log.id)
                  );
                  if (currentDeclined.length === 0) return null;

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {currentDeclined.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                            border: '1px solid #fecdd3',
                            borderLeft: '5px solid #e11d48',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem 1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(225, 29, 72, 0.08)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ffe4e6', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <AlertTriangle style={{ width: '22px', height: '22px' }} />
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '0.725rem', fontWeight: '800', textTransform: 'uppercase', background: '#fecdd3', color: '#9f1239', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                                  Request Declined Notice
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#9f1239', fontWeight: '600' }}>
                                  {item.timestamp ? formatDateTime(item.timestamp) : 'Just now'}
                                </span>
                              </div>
                              <p style={{ fontWeight: '800', color: '#881337', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                                🏢 <strong>{item.ngo_name || 'NGO Shelter'}</strong> declined the request for <strong>{item.quantity} {item.food_name}</strong>.
                              </p>
                              <p style={{ fontSize: '0.8rem', color: '#9f1239', marginTop: '0.1rem' }}>
                                You can create a new surplus donation or broadcast to other nearby verified shelters.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setDismissedDeclinedIds((prev) => [...prev, item.id])}
                            title="Dismiss notification"
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#9f1239',
                              cursor: 'pointer',
                              padding: '0.4rem',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '6px'
                            }}
                          >
                            <XCircle style={{ width: '20px', height: '20px' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* TWO-COLUMN LAYOUT: LEFT SIDEBAR NAVIGATION & MAIN CONTENT */}
                <div className="portal-dashboard-grid">
                  {/* LEFT SIDEBAR NAVIGATION OPTIONS */}
                  <div className="glass-panel portal-sidebar">
                    <div style={{ background: '#f4fbf7', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <label style={{ fontSize: '0.725rem', fontWeight: '800', color: '#047857', textTransform: 'uppercase' }}>
                          Logged In Restaurant
                        </label>
                        <span style={{ fontSize: '0.65rem', background: '#d1fae5', color: '#047857', padding: '0.15rem 0.45rem', borderRadius: '10px', fontWeight: '800' }}>
                          VERIFIED
                        </span>
                      </div>
                      <div style={{ fontWeight: '800', color: '#042f1a', fontSize: '0.925rem', margin: '0.25rem 0 0.15rem' }}>
                        🍽️ {supplierName}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                        📍 {currentSupplier.address}
                      </p>
                    </div>

                    <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', paddingLeft: '0.25rem', marginBottom: '0.1rem' }}>
                      Supplier Navigation
                    </p>

                    <div className="portal-sidebar-nav">
                      <button
                        onClick={() => {
                          setSupplierSubTab('create');
                          setFlowStep('dashboard');
                        }}
                        className={supplierSubTab === 'create' ? 'btn-primary' : 'btn-secondary'}
                        style={{
                          width: '100%',
                          justifyContent: 'flex-start',
                          padding: '0.85rem 1.1rem',
                          fontSize: '0.925rem',
                          fontWeight: '700',
                          border: supplierSubTab === 'create' ? '1px solid #059669' : '1px solid rgba(16, 185, 129, 0.2)'
                        }}
                      >
                        <PlusCircle style={{ width: '18px', height: '18px' }} /> Create Surplus Donation
                      </button>

                      <button
                        onClick={() => {
                          setSupplierSubTab('history');
                          setFlowStep('dashboard');
                        }}
                        className={supplierSubTab === 'history' ? 'btn-primary' : 'btn-secondary'}
                        style={{
                          width: '100%',
                          justifyContent: 'flex-start',
                          padding: '0.85rem 1.1rem',
                          fontSize: '0.925rem',
                          fontWeight: '700',
                          border: supplierSubTab === 'history' ? '1px solid #059669' : '1px solid rgba(16, 185, 129, 0.2)'
                        }}
                      >
                        <Layers style={{ width: '18px', height: '18px' }} /> Supplier Activity Stack
                      </button>
                    </div>
                  </div>

                  {/* RIGHT MAIN CONTENT AREA */}
                  <div>
                    {/* VIEW 1: CREATE SURPLUS DONATION SUBTAB */}
                    {supplierSubTab === 'create' && (
                      <div>
                        {/* REGISTER NEW RESTAURANT / SUPPLIER FORM CARD */}
                        {showAddSupplierForm && (
                          <div className="glass-panel" style={{ padding: '2rem', marginBottom: '1.5rem', background: '#ffffff', border: '2px solid var(--primary)' }}>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#042f1a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Utensils style={{ color: '#059669' }} /> Register New Restaurant / Food Supplier
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                              Add a new food business establishment to broadcast surplus offerings to nearby verified shelters.
                            </p>

                            <form onSubmit={handleRegisterSupplierSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                              <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#042f1a', display: 'block', marginBottom: '0.3rem' }}>
                                  Restaurant / Business Name *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Olive Garden Bistro & Bakery"
                                  value={newSupplierData.name}
                                  onChange={(e) => setNewSupplierData({ ...newSupplierData, name: e.target.value })}
                                  required
                                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                                />
                              </div>

                              <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#042f1a', display: 'block', marginBottom: '0.3rem' }}>
                                  Full Street Address & Area *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 104 Indiranagar 100ft Road, Bengaluru"
                                  value={newSupplierData.address}
                                  onChange={(e) => setNewSupplierData({ ...newSupplierData, address: e.target.value })}
                                  required
                                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                                />
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#042f1a', display: 'block', marginBottom: '0.3rem' }}>
                                    Food Type Specialty
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. Multicuisine & Bakery"
                                    value={newSupplierData.food_type_specialty}
                                    onChange={(e) => setNewSupplierData({ ...newSupplierData, food_type_specialty: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                                  />
                                </div>

                                <div>
                                  <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#042f1a', display: 'block', marginBottom: '0.3rem' }}>
                                    Contact Phone Number
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g. +91 98765 43210"
                                    value={newSupplierData.contact_phone}
                                    onChange={(e) => setNewSupplierData({ ...newSupplierData, contact_phone: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setShowAddSupplierForm(false)} className="btn-secondary">
                                  Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="btn-primary">
                                  <PlusCircle style={{ width: '16px', height: '16px' }} /> Register Restaurant
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* DEFAULT STEP: SHOW CREATE SURPLUS FOOD DONATION CARD + REAL-TIME LOGISTICS TRACKING */}
                        {flowStep === 'dashboard' && (
                          <div>
                            {/* CREATE SURPLUS FOOD DONATION CARD */}
                            <div
                              className="glass-panel"
                              style={{
                                padding: '2.75rem 2rem',
                                background: 'linear-gradient(135deg, #ffffff 0%, #ecfdf5 100%)',
                                border: '2px dashed var(--primary)',
                                textAlign: 'center',
                                boxShadow: '0 8px 25px rgba(5, 150, 105, 0.08)',
                                marginBottom: activeAcceptedLogs.length > 0 ? '2rem' : '0'
                              }}
                            >
                              <div
                                style={{
                                  width: '64px',
                                  height: '64px',
                                  borderRadius: '20px',
                                  background: '#d1fae5',
                                  color: '#047857',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  margin: '0 auto 1.25rem'
                                }}
                              >
                                <PlusCircle style={{ width: '36px', height: '36px' }} />
                              </div>

                              <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#042f1a', marginBottom: '0.5rem' }}>
                                Create Surplus Food Donation
                              </h3>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto 1.75rem', lineHeight: '1.6' }}>
                                Post surplus food quantity and usable window to immediately calculate spoilage urgency and broadcast dispatch offers to nearby verified candidate shelters.
                              </p>

                              <button
                                onClick={() => setFlowStep('create')}
                                className="btn-primary"
                                style={{ width: '100%', maxWidth: '380px', margin: '0 auto', justifyContent: 'center', fontSize: '1.05rem', padding: '1rem 1.5rem', boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)' }}
                              >
                                <PlusCircle style={{ width: '20px', height: '20px' }} /> Create & Post Surplus Food Now
                              </button>
                            </div>

                            {/* LIVE REAL-TIME LOGISTICS TRACKING CARD(S) FOR ACCEPTED RESCUE ORDERS */}
                            {activeAcceptedLogs.length > 0 && (
                              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {activeAcceptedLogs.map((log) => (
                                  <LiveLogisticsTracker key={log.id} log={log} />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* CREATE SURPLUS DONATION FORM */}
                        {flowStep === 'create' && (
                          <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '680px', margin: '0 auto', background: '#ffffff' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                              <div
                                style={{
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '12px',
                                  background: '#d1fae5',
                                  color: '#047857',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <PlusCircle style={{ width: '24px', height: '24px' }} />
                              </div>
                              <div>
                                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#042f1a' }}>
                                  Post Surplus Food Offering
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                  Fill in quantity and preparation time for immediate AI spoilage assessment.
                                </p>
                              </div>
                            </div>

                            <form onSubmit={handleStartAnalysis} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.4rem', color: '#374151' }}>
                                  Food Item Description *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 150 Meals of Veg Biryani & Paneer Gravy"
                                  value={formData.food_name}
                                  onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
                                  required
                                  style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    fontSize: '0.95rem',
                                    background: '#ffffff'
                                  }}
                                />
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.4rem', color: '#374151' }}>
                                    Quantity (Meal Servings) *
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    placeholder="150"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    required
                                    style={{
                                      width: '100%',
                                      padding: '0.85rem 1rem',
                                      borderRadius: 'var(--radius-md)',
                                      border: '1px solid rgba(16, 185, 129, 0.3)',
                                      fontSize: '0.95rem',
                                      background: '#ffffff'
                                    }}
                                  />
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.4rem', color: '#374151' }}>
                                    Usable Window (Hours) *
                                  </label>
                                  <input
                                    type="number"
                                    min="1"
                                    max="24"
                                    placeholder="5"
                                    value={formData.usable_hours}
                                    onChange={(e) => setFormData({ ...formData, usable_hours: e.target.value })}
                                    required
                                    style={{
                                      width: '100%',
                                      padding: '0.85rem 1rem',
                                      borderRadius: 'var(--radius-md)',
                                      border: '1px solid rgba(16, 185, 129, 0.3)',
                                      fontSize: '0.95rem',
                                      background: '#ffffff'
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.4rem', color: '#374151' }}>
                                  Food Classification *
                                </label>
                                <select
                                  value={formData.food_type}
                                  onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                                  style={{
                                    width: '100%',
                                    padding: '0.85rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    fontSize: '0.95rem',
                                    background: '#ffffff'
                                  }}
                                >
                                  <option value="VEGETARIAN">Vegetarian (Cooked Meals / Gravies)</option>
                                  <option value="NON_VEGETARIAN">Non-Vegetarian (Poultry / Meat)</option>
                                  <option value="PACKAGED">Packaged / Sealed Bakery Goods</option>
                                </select>
                              </div>

                              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button
                                  type="button"
                                  onClick={() => setFlowStep('dashboard')}
                                  className="btn-secondary"
                                  style={{ flex: 1, justifyContent: 'center' }}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  disabled={isSubmitting}
                                  className="btn-primary"
                                  style={{ flex: 2, justifyContent: 'center' }}
                                >
                                  <Sparkles style={{ width: '18px', height: '18px' }} /> Execute AI Spoilage Analysis
                                </button>
                              </div>
                            </form>
                          </div>
                        )}

                        {/* SPONTANEOUS SPONSORSHIP ANALYZING SCREEN */}
                        {flowStep === 'analyzing' && (
                          <div
                            className="glass-panel"
                            style={{
                              padding: '4rem 2rem',
                              textAlign: 'center',
                              maxWidth: '680px',
                              margin: '0 auto',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '1.5rem',
                              background: '#ffffff'
                            }}
                          >
                            <div style={{ position: 'relative' }}>
                              <div
                                className="animate-spin-slow"
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  borderRadius: '50%',
                                  border: '3px solid transparent',
                                  borderTopColor: 'var(--primary)',
                                  borderRightColor: '#10b981'
                                }}
                              />
                              <Sparkles
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  color: 'var(--primary)',
                                  width: '32px',
                                  height: '32px'
                                }}
                              />
                            </div>

                            <div>
                              <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#042f1a' }} className="gradient-text">
                                🤖 AI Agent Analyzing Donation...
                              </h2>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Executing NGO Matching Skill for <strong>{formData.quantity} {formData.food_name}</strong>...
                              </p>
                            </div>
                          </div>
                        )}

                        {/* NGO SELECTION & REQUEST BROADCASTING */}
                        {flowStep === 'recommended' && analysisResult && (
                          <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                              <div>
                                <span className="badge badge-success">🎯 AI Matching Skill Execution Complete</span>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '0.3rem', color: '#042f1a' }}>
                                  Select Target NGOs for Request Broadcast
                                </h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                  Sending <strong>{formData.quantity} {formData.food_name}</strong>. Check candidate NGOs below.
                                </p>
                              </div>

                              <button
                                onClick={handleBroadcastRequests}
                                disabled={isSubmitting || selectedNgoIds.length === 0}
                                className="btn-primary"
                                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
                              >
                                <Send style={{ width: '18px', height: '18px' }} /> Broadcast to ({selectedNgoIds.length}) Selected NGOs
                              </button>
                            </div>

                            {/* TOP RECOMMENDED NGO CARD */}
                            {analysisResult.recommendedNgo && (
                              <div
                                className="glass-card"
                                style={{
                                  padding: '1.5rem',
                                  marginBottom: '1.5rem',
                                  border: selectedNgoIds.includes(analysisResult.recommendedNgo.id)
                                    ? '2px solid var(--primary)'
                                    : '1px solid rgba(16, 185, 129, 0.2)',
                                  boxShadow: selectedNgoIds.includes(analysisResult.recommendedNgo.id) ? '0 0 25px rgba(5, 150, 105, 0.15)' : 'none'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                                    <div
                                      onClick={() => toggleNgoSelection(analysisResult.recommendedNgo.id)}
                                      style={{ cursor: 'pointer', marginTop: '0.2rem' }}
                                    >
                                      {selectedNgoIds.includes(analysisResult.recommendedNgo.id) ? (
                                        <CheckSquare style={{ color: 'var(--primary)', width: '24px', height: '24px' }} />
                                      ) : (
                                        <Square style={{ color: 'var(--text-muted)', width: '24px', height: '24px' }} />
                                      )}
                                    </div>

                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span className="badge badge-success">⭐ Top AI Recommendation</span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)' }}>
                                          {analysisResult.recommendedNgo.matchScore}% Match
                                        </span>
                                      </div>

                                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '0.3rem', color: '#042f1a' }}>
                                        {analysisResult.recommendedNgo.name}
                                      </h3>
                                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                        📍 {analysisResult.recommendedNgo.address} ({analysisResult.recommendedNgo.distanceKm} km away)
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* OTHER NGO CANDIDATES */}
                            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', color: '#042f1a' }}>
                              Other Verified Shelter Candidates ({(analysisResult.alternativeNgos || analysisResult.ngos || []).length})
                            </h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {(analysisResult.alternativeNgos || analysisResult.ngos || []).map((ngo) => {
                                const isSelected = selectedNgoIds.includes(ngo.id);
                                return (
                                  <div
                                    key={ngo.id}
                                    className="glass-card"
                                    style={{
                                      padding: '1.25rem',
                                      display: 'flex',
                                      justify: 'space-between',
                                      alignItems: 'center',
                                      border: isSelected ? '1px solid #059669' : '1px solid rgba(16, 185, 129, 0.2)',
                                      background: isSelected ? '#ecfdf5' : '#ffffff'
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                      <div onClick={() => toggleNgoSelection(ngo.id)} style={{ cursor: 'pointer' }}>
                                        {isSelected ? (
                                          <CheckSquare style={{ color: '#059669', width: '22px', height: '22px' }} />
                                        ) : (
                                          <Square style={{ color: 'var(--text-muted)', width: '22px', height: '22px' }} />
                                        )}
                                      </div>

                                      <div>
                                        <h4 style={{ fontWeight: '700', fontSize: '1.1rem', color: '#042f1a' }}>{ngo.name}</h4>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                          {ngo.distanceKm} km away • Daily Demand: {ngo.demand} meals • Storage Capacity: {ngo.capacity} meals
                                        </p>
                                      </div>
                                    </div>

                                    <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#059669' }}>
                                      {ngo.matchScore}% Score
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* BROADCAST SENT CONFIRMATION */}
                        {flowStep === 'broadcast_sent' && (
                          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', maxWidth: '750px', margin: '0 auto', background: '#ffffff' }}>
                            <div
                              style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: '#d1fae5',
                                color: '#047857',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.25rem'
                              }}
                            >
                              <Send style={{ width: '30px', height: '30px' }} />
                            </div>

                            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#042f1a' }} className="gradient-text">
                              📡 Donation Request Broadcasted!
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem', marginBottom: '2rem' }}>
                              Sent request for <strong>{formData.quantity} {formData.food_name}</strong> to {selectedNgoIds.length} selected NGO shelters.
                            </p>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => {
                                  setSupplierSubTab('history');
                                  setFlowStep('dashboard');
                                }}
                                className="btn-primary"
                              >
                                <Layers style={{ width: '16px', height: '16px' }} /> View Supplier Activity Stack
                              </button>
                              <button onClick={() => setFlowStep('dashboard')} className="btn-secondary">
                                <PlusCircle style={{ width: '16px', height: '16px' }} /> Create Another Donation
                              </button>
                            </div>

                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
                              <Lock style={{ width: '12px', height: '12px', color: '#059669' }} /> To view shelter requests or access another portal, log in via the top-right Login menu.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* VIEW 2: SUPPLIER ACTIVITY STACK (HISTORY) SUBTAB */}
                    {supplierSubTab === 'history' && (
                      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#042f1a' }}>
                          <Layers style={{ color: 'var(--primary)' }} /> Supplier Activity Stack ({supplierName})
                        </h3>

                        {historyLogs.filter((log) => log.type !== 'DECLINED' && (log.supplier_id === selectedSupplierUser || log.supplier_name === supplierName)).length === 0 ? (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No historical decision logs in stack for {supplierName}. Click "Create Surplus Donation" in the menu to post your first offering!</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                             {historyLogs
                               .filter((log) => log.type !== 'DECLINED' && (log.supplier_id === selectedSupplierUser || log.supplier_name === supplierName))
                               .map((log) => {
                                const estDeliveryIso = log.estimated_delivery_at || new Date(new Date(log.dispatched_at || log.timestamp || log.requested_at).getTime() + (log.total_eta_mins || 22) * 60 * 1000).toISOString();
                                const isInTransit = log.type === 'ACCEPTED' && Date.now() < new Date(estDeliveryIso).getTime();

                                return (
                                  <div
                                    key={log.id}
                                    className="glass-card"
                                    style={{
                                      padding: '1.25rem',
                                      borderLeft:
                                        log.type === 'ACCEPTED'
                                          ? (isInTransit ? '4px solid #059669' : '4px solid #047857')
                                          : log.type === 'DECLINED'
                                          ? '4px solid #be123c'
                                          : '4px solid #059669'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                          <span className={log.type === 'ACCEPTED' ? (isInTransit ? 'badge badge-medium' : 'badge badge-success') : log.type === 'DECLINED' ? 'badge badge-high' : 'badge badge-medium'}>
                                            {log.type === 'ACCEPTED' ? (isInTransit ? '🚚 IN TRANSIT & DISPATCHED' : '✅ DELIVERED & RECEIVED') : log.type === 'DECLINED' ? '❌ DECLINED' : '⏳ PENDING'}
                                          </span>
                                        </div>

                                        <h4 style={{ fontWeight: '800', fontSize: '1.1rem', color: '#042f1a', marginTop: '0.2rem' }}>
                                          {log.quantity} {log.food_name}
                                        </h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                          Target NGO: <strong>{log.ngo_name}</strong>
                                        </p>

                                        {log.type === 'ACCEPTED' && (
                                          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                              <span>🚀 <strong>Dispatched:</strong> {formatDateTime(log.dispatched_at || log.timestamp || log.requested_at)}</span>
                                              <span>
                                                🏁 <strong>{isInTransit ? 'Est. Delivery Arrival:' : 'Delivered / Received:'}</strong> {formatDateTime(estDeliveryIso)}
                                                {isInTransit && <strong style={{ color: '#059669', marginLeft: '0.35rem' }}>(In Transit)</strong>}
                                              </span>
                                            </div>

                                            <div style={{ background: '#f4fbf7', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                              <div style={{ color: '#047857', fontWeight: '700' }}>
                                                🛵 <strong>Delivery Partner:</strong> {log.delivery_partner || log.delivery_partner_name || 'Vikram Singh (Rider #FB-104 - EV Cargo Bike)'}
                                              </div>
                                              <div style={{ color: '#059669', fontWeight: '700' }}>
                                                🛡️ <strong>FoodBridge Assistant:</strong> {log.foodbridge_assistant || 'Priya Sharma (Food Safety Inspector #FBA-12)'}
                                              </div>
                                              <div style={{ color: '#0d9488', fontWeight: '600' }}>
                                                ⏱️ <strong>Transit Time:</strong> {log.supplier_eta_mins || 8} mins to Supplier ➔ {log.ngo_eta_mins || 14} mins to NGO Shelter ({log.total_eta_mins || 22} mins total)
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                    {log.type !== 'ACCEPTED' && (
                                      <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontWeight: '500' }}>
                                        {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </p>
                                    )}
                                  </div>

                                  <button
                                    onClick={(e) => handleDeleteHistoryLog(log.id, e)}
                                    title="Delete history entry"
                                    style={{
                                      background: '#ffe4e6',
                                      color: '#be123c',
                                      border: '1px solid #fecdd3',
                                      borderRadius: '8px',
                                      padding: '0.4rem 0.6rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <Trash2 style={{ width: '15px', height: '15px' }} />
                                  </button>
                                </div>
                              </div>
                            ); })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* NGO SHELTER DASHBOARD WITH LEFT SIDEBAR NAVIGATION */}
            {userRole === 'ngo' && (
              <div>
                {/* NGO HEADER BAR WITH ACTIVE SHELTER SELECTOR */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#042f1a' }}>
                      <LayoutDashboard style={{ color: '#0d9488' }} /> NGO Shelter Dashboard — <span className="gradient-text">{currentNgoName}</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                      Operational View: Incoming Rescue Requests, Decision Controls, and Real-Time Spoilage Tracking.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', background: '#f0fdfa', padding: '0.5rem 0.9rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(13, 148, 136, 0.3)' }}>
                    <span style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: '800', textTransform: 'uppercase' }}>Logged In:</span>
                    <span style={{ fontSize: '0.9rem', color: '#042f1a', fontWeight: '800' }}>🏢 {currentNgoName}</span>
                    <span style={{ fontSize: '0.65rem', background: '#ccfbf1', color: '#0f766e', padding: '0.15rem 0.45rem', borderRadius: '10px', fontWeight: '800' }}>VERIFIED</span>
                  </div>
                </div>

                {/* NOTIFICATION BANNER */}
                {ngoNotification && (
                  <div
                    style={{
                      padding: '1rem 1.5rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.5rem',
                      background:
                        ngoNotification.type === 'error'
                          ? '#ffe4e6'
                          : ngoNotification.type === 'success'
                          ? '#d1fae5'
                          : '#e0f2fe',
                      border:
                        ngoNotification.type === 'error'
                          ? '1px solid #fecdd3'
                          : ngoNotification.type === 'success'
                          ? '1px solid #a7f3d0'
                          : '1px solid #bae6fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '1rem', color: ngoNotification.type === 'error' ? '#be123c' : '#047857' }}>
                        {ngoNotification.title}
                      </p>
                      <p style={{ fontSize: '0.85rem', marginTop: '0.2rem', color: '#1f2937' }}>{ngoNotification.message}</p>
                    </div>
                    <button onClick={() => setNgoNotification(null)} className="btn-secondary" style={{ padding: '0.3rem 0.6rem' }}>
                      Dismiss
                    </button>
                  </div>
                )}

                {/* TWO-COLUMN GRID LAYOUT WITH LEFT SIDEBAR NAVIGATION */}
                <div className="portal-dashboard-grid">
                  {/* LEFT SIDEBAR NAVIGATION */}
                  <div className="glass-panel portal-sidebar">
                    <p style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                      NGO Navigation Menu
                    </p>

                    <div className="portal-sidebar-nav">
                      <button
                        onClick={() => setNgoSubTab('requests')}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: ngoSubTab === 'requests' ? 'var(--primary)' : 'transparent',
                          color: ngoSubTab === 'requests' ? '#ffffff' : '#042f1a',
                          fontSize: '0.925rem',
                          fontWeight: '700',
                          border: ngoSubTab === 'requests' ? '1px solid var(--primary)' : '1px solid rgba(16, 185, 129, 0.2)'
                        }}
                      >
                        <Bell style={{ width: '18px', height: '18px' }} /> Supplier Request
                      </button>

                      <button
                        onClick={() => setNgoSubTab('history')}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-md)',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: ngoSubTab === 'history' ? '#047857' : 'transparent',
                          color: ngoSubTab === 'history' ? '#ffffff' : '#042f1a',
                          fontSize: '0.925rem',
                          fontWeight: '700',
                          border: ngoSubTab === 'history' ? '1px solid #059669' : '1px solid rgba(16, 185, 129, 0.2)'
                        }}
                      >
                        <Layers style={{ width: '18px', height: '18px' }} /> History - NGO Activity Stack
                      </button>
                    </div>
                  </div>

                  {/* RIGHT MAIN CONTENT AREA */}
                  <div>
                    {/* VIEW 1: SUPPLIER REQUEST SUBTAB */}
                    {ngoSubTab === 'requests' && (
                      <div>
                        {/* INCOMING DONATION REQUEST STACK */}
                        <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#042f1a' }}>
                            <Bell style={{ color: 'var(--accent-amber)', width: '20px', height: '20px' }} /> Incoming Food Rescue Request Stack
                          </h3>

                          {ngoRequests.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                              <CheckCircle2 style={{ width: '40px', height: '40px', margin: '0 auto 1rem', opacity: 0.5 }} />
                              <p style={{ fontSize: '1rem', fontWeight: '600' }}>No pending requests for {currentNgoName}</p>
                              <p style={{ fontSize: '0.85rem', marginTop: '0.3rem' }}>
                                Switch to Supplier persona to post surplus and broadcast a request!
                              </p>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                              {ngoRequests.map((req) => (
                                <div
                                  key={req.id}
                                  className="glass-card"
                                  style={{
                                    padding: '1.5rem',
                                    border: req.status === 'PENDING' ? '1px solid #059669' : '1px solid rgba(16, 185, 129, 0.2)'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                                        <span className="badge badge-medium">Incoming Donation Offer</span>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                          Received {new Date(req.requested_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(req.requested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>

                                      <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#042f1a' }}>
                                        {req.quantity} {req.food_name}
                                      </h4>
                                      <p style={{ fontSize: '0.9rem', color: '#059669', fontWeight: '700', marginTop: '0.2rem' }}>
                                        From Supplier: 🍽️ {req.supplier_name}
                                      </p>

                                      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                          <Clock style={{ width: '14px', height: '14px', color: 'var(--accent-amber)' }} /> Safe Window: {req.usable_hours}h
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                          <Utensils style={{ width: '14px', height: '14px', color: '#059669' }} /> Type: {req.food_type}
                                        </span>
                                      </div>
                                    </div>

                                    {/* ACTION BUTTONS */}
                                    <div>
                                      {req.status === 'PENDING' && (
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                          <button
                                            onClick={() => handleNgoResponse(req.id, 'DECLINE')}
                                            disabled={isSubmitting}
                                            className="btn-secondary"
                                            style={{ border: '1px solid #fecdd3', color: '#be123c', background: '#fff1f2' }}
                                          >
                                            <XCircle style={{ width: '16px', height: '16px' }} /> Decline
                                          </button>
                                          <button
                                            onClick={() => handleNgoResponse(req.id, 'ACCEPT')}
                                            disabled={isSubmitting}
                                            className="btn-primary"
                                          >
                                            <CheckCircle2 style={{ width: '16px', height: '16px' }} /> Accept & Dispatch Pickup
                                          </button>
                                        </div>
                                      )}

                                      {req.status === 'ACCEPTED' && (
                                        <span className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>
                                          ✅ Request Accepted by You
                                        </span>
                                      )}

                                      {req.status === 'DECLINED' && (
                                        <span className="badge badge-high" style={{ padding: '0.5rem 1rem' }}>
                                          ❌ Request Declined
                                        </span>
                                      )}

                                      {req.status === 'EXPIRED_ACCEPTED_BY_OTHER' && (
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                          ⚪ Already accepted by another shelter
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                                          {/* LIVE REAL-TIME LOGISTICS TRACKING CARD(S) FOR ACTIVE ACCEPTED RESCUE ORDERS FOR THIS NGO */}
                        {activeNgoAcceptedLogs.length > 0 && (
                          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {activeNgoAcceptedLogs.map((log) => (
                              <LiveLogisticsTracker key={log.id} log={log} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* VIEW 2: HISTORY - NGO ACTIVITY STACK SUBTAB */}
                    {ngoSubTab === 'history' && (
                      <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#042f1a' }}>
                          <Layers style={{ color: 'var(--primary)' }} /> NGO Activity Stack ({currentNgoName})
                        </h3>

                        {historyLogs.filter((log) => log.ngo_id === selectedNgoUser).length === 0 ? (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No historical decisions in stack for this shelter.</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {historyLogs
                              .filter((log) => log.ngo_id === selectedNgoUser)
                              .map((log) => {
                                const estDeliveryIso = log.estimated_delivery_at || new Date(new Date(log.dispatched_at || log.timestamp || log.requested_at).getTime() + (log.total_eta_mins || 22) * 60 * 1000).toISOString();
                                const isInTransit = log.type === 'ACCEPTED' && Date.now() < new Date(estDeliveryIso).getTime();

                                return (
                                  <div
                                    key={log.id}
                                    className="glass-card"
                                    style={{
                                      padding: '1.25rem',
                                      borderLeft:
                                        log.type === 'ACCEPTED'
                                          ? (isInTransit ? '4px solid #059669' : '4px solid #047857')
                                          : log.type === 'DECLINED'
                                          ? '4px solid #be123c'
                                          : '4px solid #059669'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                                      <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                          <span className={log.type === 'ACCEPTED' ? (isInTransit ? 'badge badge-medium' : 'badge badge-success') : log.type === 'DECLINED' ? 'badge badge-high' : 'badge badge-medium'}>
                                            {log.type === 'ACCEPTED' ? (isInTransit ? '🚚 IN TRANSIT & DISPATCHED' : '✅ DELIVERED & RECEIVED') : log.type === 'DECLINED' ? '❌ DECLINED' : '⏳ PENDING'}
                                          </span>
                                        </div>

                                        <h4 style={{ fontWeight: '800', fontSize: '1.1rem', color: '#042f1a', marginTop: '0.2rem' }}>
                                          {log.quantity} {log.food_name}
                                        </h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                          Supplier: <strong>{log.supplier_name}</strong>
                                        </p>

                                        {log.type === 'ACCEPTED' && (
                                          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                              <span>🚀 <strong>Dispatched:</strong> {formatDateTime(log.dispatched_at || log.timestamp || log.requested_at)}</span>
                                              <span>
                                                🏁 <strong>{isInTransit ? 'Est. Delivery Arrival:' : 'Delivered / Received:'}</strong> {formatDateTime(estDeliveryIso)}
                                                {isInTransit && <strong style={{ color: '#059669', marginLeft: '0.35rem' }}>(In Transit)</strong>}
                                              </span>
                                            </div>

                                            <div style={{ background: '#f4fbf7', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                              <div style={{ color: '#047857', fontWeight: '700' }}>
                                                🛵 <strong>Delivery Partner:</strong> {log.delivery_partner || log.delivery_partner_name || 'Vikram Singh (Rider #FB-104 - EV Cargo Bike)'}
                                              </div>
                                              <div style={{ color: '#059669', fontWeight: '700' }}>
                                                🛡️ <strong>FoodBridge Assistant:</strong> {log.foodbridge_assistant || 'Priya Sharma (Food Safety Inspector #FBA-12)'}
                                              </div>
                                              <div style={{ color: '#0d9488', fontWeight: '600' }}>
                                                ⏱️ <strong>Transit Time:</strong> {log.supplier_eta_mins || 8} mins to Supplier ➔ {log.ngo_eta_mins || 14} mins to NGO Shelter ({log.total_eta_mins || 22} mins total)
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {log.type !== 'ACCEPTED' && (
                                          <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontWeight: '500' }}>
                                            {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </p>
                                        )}
                                      </div>

                                      <button
                                        onClick={(e) => handleDeleteHistoryLog(log.id, e)}
                                        title="Delete history entry"
                                        style={{
                                          background: '#ffe4e6',
                                          color: '#be123c',
                                          border: '1px solid #fecdd3',
                                          borderRadius: '8px',
                                          padding: '0.4rem 0.6rem',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          cursor: 'pointer'
                                        }}
                                      >
                                        <Trash2 style={{ width: '15px', height: '15px' }} />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NGO SIGNED / DIRECTORY WITH REGISTER NGO & REQUIRED DOCUMENTS FORM */}
        {!authView && activeTab === 'ngos' && (
          <div className="glass-panel" style={{ padding: '2rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#042f1a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 style={{ color: '#059669' }} /> Verified NGO Shelter Directory
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Real-time receiving capacity, meal demand, and verified registration documents of partner shelters.
                </p>
              </div>

              <button
                onClick={() => setShowAddNgoForm(!showAddNgoForm)}
                className="btn-primary"
                style={{ padding: '0.8rem 1.4rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <PlusCircle style={{ width: '18px', height: '18px' }} /> {showAddNgoForm ? 'Close Registration' : '+ Register New NGO Shelter'}
              </button>
            </div>

            {/* REGISTER NEW NGO WITH REQUIRED DOCUMENTS FORM */}
            {showAddNgoForm && (
              <div
                className="glass-card"
                style={{
                  padding: '2rem',
                  marginBottom: '2rem',
                  border: '2px dashed #059669',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: '#d1fae5',
                      color: '#047857',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FileCheck style={{ width: '22px', height: '22px' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#042f1a' }}>
                      Register New NGO Shelter & Verification Documents
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Fill in shelter details and attach required compliance proof to verify for food rescue dispatch.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleRegisterNgoSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#374151' }}>
                      Organization / Shelter Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sunrise Community Kitchen"
                      value={newNgoData.organization_name}
                      onChange={(e) => setNewNgoData({ ...newNgoData, organization_name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '0.9rem',
                        background: '#ffffff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#374151' }}>
                      Full Physical Address *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 102 Whitefield Main Road"
                      value={newNgoData.address}
                      onChange={(e) => setNewNgoData({ ...newNgoData, address: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '0.9rem',
                        background: '#ffffff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#374151' }}>
                      Daily Meal Capacity (Meals)
                    </label>
                    <input
                      type="number"
                      min="10"
                      value={newNgoData.capacity}
                      onChange={(e) => setNewNgoData({ ...newNgoData, capacity: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '0.9rem',
                        background: '#ffffff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#374151' }}>
                      Daily Meal Demand (Meals)
                    </label>
                    <input
                      type="number"
                      min="10"
                      value={newNgoData.demand}
                      onChange={(e) => setNewNgoData({ ...newNgoData, demand: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '0.9rem',
                        background: '#ffffff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#374151' }}>
                      Distance from City Center (km)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newNgoData.distance_km}
                      onChange={(e) => setNewNgoData({ ...newNgoData, distance_km: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '0.9rem',
                        background: '#ffffff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#374151' }}>
                      Required Verification Document Type *
                    </label>
                    <select
                      value={newNgoData.doc_type}
                      onChange={(e) => setNewNgoData({ ...newNgoData, doc_type: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '0.9rem',
                        background: '#ffffff'
                      }}
                    >
                      <option value="80G / 12A Certificate">80G / 12A Tax Exempt Certificate</option>
                      <option value="FSSAI License">FSSAI Food Safety License</option>
                      <option value="NGO Darpan ID">Govt NGO Darpan Portal ID</option>
                      <option value="Society Registration">Trust / Society Registration Act</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#374151' }}>
                      Document / License Reg Number *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. REG-998231 / FSSAI-11294"
                      value={newNgoData.doc_id}
                      onChange={(e) => setNewNgoData({ ...newNgoData, doc_id: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        fontSize: '0.9rem',
                        background: '#ffffff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.35rem', color: '#374151' }}>
                      Upload Verification Document / Proof Title *
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="text"
                        placeholder="e.g. Sunrise_Kitchen_80G_Proof.pdf"
                        value={newNgoData.doc_file_name}
                        onChange={(e) => setNewNgoData({ ...newNgoData, doc_file_name: e.target.value })}
                        required
                        style={{
                          flex: 1,
                          padding: '0.75rem 0.9rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          fontSize: '0.9rem',
                          background: '#ffffff'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newNgoData.doc_file_name) {
                            setNewNgoData({ ...newNgoData, doc_file_name: `${(newNgoData.organization_name || 'NGO').replace(/\s+/g, '_')}_Verification_Doc.pdf` });
                          }
                        }}
                        className="btn-secondary"
                        style={{ padding: '0.75rem 0.9rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                      >
                        <Upload style={{ width: '15px', height: '15px' }} /> Auto-Attach
                      </button>
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button type="button" onClick={() => setShowAddNgoForm(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '0.95rem' }}>
                      <FileCheck style={{ width: '18px', height: '18px' }} /> Submit & Register Verified NGO
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* DIRECTORY LISTING CARDS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {ngoList.map((ngo) => (
                <div key={ngo.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <div>
                        <span className="badge badge-success">✓ Verified Shelter</span>
                        <h3 style={{ fontSize: '1.25rem', marginTop: '0.4rem', fontWeight: '700', color: '#042f1a' }}>
                          {ngo.organization_name || ngo.name}
                        </h3>
                      </div>
                      <Building2 style={{ color: '#059669', width: '24px', height: '24px' }} />
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin style={{ width: '14px', height: '14px' }} /> {ngo.address} ({ngo.distanceKm || ngo.distance || '3.5'} km)
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: '#f4fbf7', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Meal Demand</p>
                        <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#059669' }}>{ngo.demand} meals</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Available Capacity</p>
                        <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#047857' }}>{ngo.capacity} meals</p>
                      </div>
                    </div>
                  </div>

                  {/* VERIFIED REQUIRED DOCUMENTATION FOOTER */}
                  <div
                    style={{
                      borderTop: '1px dashed rgba(16, 185, 129, 0.3)',
                      paddingTop: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#047857', fontWeight: '600' }}>
                      <FileText style={{ width: '14px', height: '14px', color: '#059669' }} />
                      <span>{ngo.doc_type || '80G / 12A Certificate'}: <strong>{ngo.doc_id || 'REG-882910'}</strong></span>
                    </div>
                    <span
                      title={`Attached Proof: ${ngo.doc_file_name || 'Verified_Doc.pdf'}`}
                      style={{
                        background: '#d1fae5',
                        color: '#047857',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        fontWeight: '700',
                        fontSize: '0.7rem'
                      }}
                    >
                      📎 {ngo.doc_file_name || 'Verified_Doc.pdf'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <footer
        style={{
          borderTop: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.8rem',
          background: '#ffffff'
        }}
      >
        FoodBridge Editorial Edition • Surplus Rescue & AI NGO Matching Platform
      </footer>
    </div>
  );
}

