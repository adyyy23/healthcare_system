/**
 * HealthCare System 2026 — Modern Spatial Application Store & Logic
 * High-performance, modular, accessible, and offline-resilient PWA application.
 */

// ============================================================================
// 1. DATA MODEL & INITIAL STORE
// ============================================================================

const CLINICS_DATA = [
  {
    id: 'clinic-1',
    name: 'St. Jude Medical Center — Downtown Main Campus',
    address: '450 Lexington Ave, Suite 400, New York, NY 10017',
    lat: 40.7527,
    lng: -73.9772,
    phone: '(212) 555-0140',
    distance: '0.8 mi',
    hours: 'Mon - Fri: 8:00 AM - 7:00 PM | Sat: 9:00 AM - 3:00 PM',
    specialties: ['Cardiology', 'Internal Medicine', 'Dermatology', 'Orthopedics'],
    doctors: ['Dr. Sarah Ramos, MD', 'Dr. Julian Santos, MD']
  },
  {
    id: 'clinic-2',
    name: 'Metropolitan Health Pavilion & Urgent Care',
    address: '120 E 34th St, New York, NY 10016',
    lat: 40.7465,
    lng: -73.9798,
    phone: '(212) 555-0192',
    distance: '1.2 mi',
    hours: 'Daily: 7:00 AM - 9:00 PM (Walk-ins & Appointments)',
    specialties: ['General Medicine', 'Pediatrics', 'Dermatology'],
    doctors: ['Dr. Elena Vance, MD', 'Dr. Arthur Davies, MD', 'Dr. Julian Santos, MD']
  },
  {
    id: 'clinic-3',
    name: 'Upper East Specialty Care & Diagnostics',
    address: '890 5th Ave, New York, NY 10021',
    lat: 40.7712,
    lng: -73.9654,
    phone: '(212) 555-0218',
    distance: '2.1 mi',
    hours: 'Mon - Fri: 8:30 AM - 5:30 PM',
    specialties: ['Cardiology', 'Neurology', 'Orthopedics'],
    doctors: ['Dr. Sarah Ramos, MD', 'Dr. Marcus Chen, MD', 'Dr. Olivia Lin, MD']
  },
  {
    id: 'clinic-4',
    name: 'Riverside Pediatrics & Family Health',
    address: '210 Riverside Dr, New York, NY 10025',
    lat: 40.7938,
    lng: -73.9752,
    phone: '(212) 555-0312',
    distance: '3.4 mi',
    hours: 'Mon - Sat: 8:00 AM - 4:00 PM',
    specialties: ['Pediatrics', 'General Medicine'],
    doctors: ['Dr. Arthur Davies, MD', 'Dr. Olivia Lin, MD']
  }
];

const DOCTORS_DATA = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Ramos, MD',
    specialty: 'Cardiology',
    subSpecialty: 'Cardiology & Cardiovascular Care',
    photo: 'images/doctor 1.jpg',
    rating: 4.9,
    reviewsCount: 128,
    experience: '14 years experience',
    license: 'MED-84920',
    clinicId: 'clinic-1',
    clinicName: 'St. Jude Medical Center',
    telehealth: true,
    inPerson: true,
    availableToday: true,
    hours: 'Mon - Fri (09:00 AM - 04:00 PM)',
    bio: 'Board-certified cardiologist specializing in preventive cardiology, echocardiography, cardiac arrhythmias, and post-angioplasty care. Fellowship at Mount Sinai.',
    education: 'Johns Hopkins School of Medicine • MD (Cardiology)'
  },
  {
    id: 'doc-2',
    name: 'Dr. Julian Santos, MD',
    specialty: 'General Medicine',
    subSpecialty: 'General Internal Medicine & Preventive Care',
    photo: 'images/doctor 2.jpg',
    rating: 4.8,
    reviewsCount: 94,
    experience: '11 years experience',
    license: 'MED-71044',
    clinicId: 'clinic-1',
    clinicName: 'St. Jude Medical Center',
    telehealth: true,
    inPerson: true,
    availableToday: true,
    hours: 'Mon - Sat (08:00 AM - 02:00 PM)',
    bio: 'Attending physician focusing on comprehensive adult health exams, metabolic disorder management, diagnostic evaluations, and health screenings.',
    education: 'Columbia University Vagelos College of Physicians and Surgeons'
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Vance, MD',
    specialty: 'Dermatology',
    subSpecialty: 'Dermatology & Skin Pathology',
    photo: 'images/doctor 3.jpg',
    rating: 4.95,
    reviewsCount: 182,
    experience: '12 years experience',
    license: 'MED-90218',
    clinicId: 'clinic-2',
    clinicName: 'Metropolitan Health Pavilion',
    telehealth: true,
    inPerson: true,
    availableToday: false,
    hours: 'Tue - Thu (10:00 AM - 05:00 PM)',
    bio: 'Expert dermatologist dedicated to medical dermatology, mole mapping, eczema, psoriasis, and dermatologic surgical procedures.',
    education: 'NYU Grossman School of Medicine'
  },
  {
    id: 'doc-4',
    name: 'Dr. Arthur Davies, MD',
    specialty: 'Pediatrics',
    subSpecialty: 'Pediatrics & Adolescent Medicine',
    photo: 'images/doctor 4.jpg',
    rating: 4.9,
    reviewsCount: 110,
    experience: '16 years experience',
    license: 'MED-63109',
    clinicId: 'clinic-2',
    clinicName: 'Metropolitan Health Pavilion',
    telehealth: true,
    inPerson: true,
    availableToday: true,
    hours: 'Mon - Fri (09:00 AM - 03:00 PM)',
    bio: 'Compassionate pediatrician focusing on developmental milestones, newborn wellness, adolescent care, vaccinations, and pediatric asthma.',
    education: 'Harvard Medical School'
  },
  {
    id: 'doc-5',
    name: 'Dr. Marcus Chen, MD',
    specialty: 'Orthopedics',
    subSpecialty: 'Orthopedic Surgery & Sports Medicine',
    photo: 'images/doctor 5.jpg',
    rating: 4.85,
    reviewsCount: 76,
    experience: '9 years experience',
    license: 'MED-77402',
    clinicId: 'clinic-3',
    clinicName: 'Upper East Specialty Care',
    telehealth: false,
    inPerson: true,
    availableToday: false,
    hours: 'Wed - Sat (08:30 AM - 03:30 PM)',
    bio: 'Specialist in joint preservation, sports-related knee and shoulder injuries, minimally invasive arthroscopy, and rehabilitation planning.',
    education: 'Cornell University Weill Medical College'
  },
  {
    id: 'doc-6',
    name: 'Dr. Olivia Lin, MD',
    specialty: 'Neurology',
    subSpecialty: 'Neurology & Headache Specialist',
    photo: 'images/doctor 6.jpg',
    rating: 4.92,
    reviewsCount: 89,
    experience: '13 years experience',
    license: 'MED-58219',
    clinicId: 'clinic-3',
    clinicName: 'Upper East Specialty Care',
    telehealth: true,
    inPerson: true,
    availableToday: true,
    hours: 'Mon - Thu (09:30 AM - 04:30 PM)',
    bio: 'Neurologist with specialized focus on chronic migraine management, neuropathy, neuro-diagnostics, and cognitive health assessments.',
    education: 'Yale School of Medicine'
  }
];

const SERVICES_DATA = [
  { id: 'srv-1', name: 'Cardiology', title: 'Cardiology Consultation', desc: 'Heart rhythm evaluation, ECG, blood pressure management, and cardiovascular wellness', fee: '$150', time: '45 mins' },
  { id: 'srv-2', name: 'General Medicine', title: 'General Internal Medicine', desc: 'Routine health checkup, physical diagnostics, wellness clearance, and lab reviews', fee: '$95', time: '30 mins' },
  { id: 'srv-3', name: 'Dermatology', title: 'Dermatology & Skin Care', desc: 'Skin lesion inspection, rash treatment, acne management, and mole checks', fee: '$120', time: '30 mins' },
  { id: 'srv-4', name: 'Pediatrics', title: 'Pediatrics Wellness Check', desc: 'Child health screening, immunizations, developmental review, and acute illness care', fee: '$100', time: '30 mins' },
  { id: 'srv-5', name: 'Orthopedics', title: 'Orthopedics & Joint Clinic', desc: 'Joint pain examination, mobility testing, sports injury review, and physical therapy plans', fee: '$140', time: '40 mins' },
  { id: 'srv-6', name: 'Neurology', title: 'Neurology & Headache Clinic', desc: 'Migraine protocol, nerve conductivity check, dizziness review, and memory screening', fee: '$160', time: '45 mins' }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: 1,
    refCode: 'APT-2026-8491',
    patientName: 'Mariane Millera',
    email: 'mariane.millera@gmail.com',
    phone: '+1 (555) 019-2834',
    doctor: 'Dr. Sarah Ramos, MD',
    specialty: 'Cardiology',
    clinic: 'St. Jude Medical Center — Downtown Main Campus',
    clinicAddress: '450 Lexington Ave, Suite 400, New York',
    date: '2026-10-08',
    time: '10:30 AM',
    type: 'Telehealth',
    status: 'approved', // approved, pending, completed, cancelled
    reason: 'Follow-up on resting heart rate rhythm and mild chest tightness after light exercise.',
    notes: 'Patient advised to monitor systolic BP twice daily. ECG scheduled.'
  },
  {
    id: 2,
    refCode: 'APT-2026-8102',
    patientName: 'Trish Anne Revilla',
    email: 'trish.revilla@gmail.com',
    phone: '+1 (555) 019-0841',
    doctor: 'Dr. Julian Santos, MD',
    specialty: 'General Medicine',
    clinic: 'Metropolitan Health Pavilion & Urgent Care',
    clinicAddress: '120 E 34th St, New York',
    date: '2026-10-12',
    time: '02:00 PM',
    type: 'In-Person',
    status: 'pending',
    reason: 'Annual preventive bloodwork panel and comprehensive wellness review.',
    notes: ''
  },
  {
    id: 3,
    refCode: 'APT-2026-7934',
    patientName: 'Mariane Millera',
    email: 'mariane.millera@gmail.com',
    phone: '+1 (555) 019-2834',
    doctor: 'Dr. Elena Vance, MD',
    specialty: 'Dermatology',
    clinic: 'Metropolitan Health Pavilion & Urgent Care',
    clinicAddress: '120 E 34th St, New York',
    date: '2026-09-22',
    time: '11:15 AM',
    type: 'In-Person',
    status: 'completed',
    reason: 'Routine seasonal eczema review and topical cream prescription.',
    notes: 'Prescribed Hydrocortisone 1% topical cream for 14 days. Cleared.'
  },
  {
    id: 4,
    refCode: 'APT-2026-7450',
    patientName: 'David Miller',
    email: 'david.m@gmail.com',
    phone: '+1 (555) 019-5432',
    doctor: 'Dr. Arthur Davies, MD',
    specialty: 'Pediatrics',
    clinic: 'Riverside Pediatrics & Family Health',
    clinicAddress: '210 Riverside Dr, New York',
    date: '2026-09-15',
    time: '09:00 AM',
    type: 'In-Person',
    status: 'completed',
    reason: 'Annual school health and sports clearance exam.',
    notes: 'Height: 52in, Weight: 64lbs. Vitals healthy. Clearance form issued.'
  }
];

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Consultation Confirmed',
    message: 'Your Telehealth appointment with Dr. Sarah Ramos is confirmed for Oct 8 at 10:30 AM.',
    time: '10 mins ago',
    read: false,
    type: 'appointment'
  },
  {
    id: 'notif-2',
    title: 'Doctor Follow-Up Note',
    message: 'Dr. Julian Santos posted new clinical recommendations to your health summary.',
    time: '2 hours ago',
    read: false,
    type: 'message'
  },
  {
    id: 'notif-3',
    title: 'Prescription Ready',
    message: 'Your electronic prescription for Atorvastatin 20mg was sent to St. Jude Pharmacy.',
    time: 'Yesterday',
    read: true,
    type: 'pharmacy'
  }
];

// App State Management
class HealthcareStore {
  constructor() {
    this.appointments = this.load('healthcare_appts', DEFAULT_APPOINTMENTS);
    this.notifications = this.load('healthcare_notifs', DEFAULT_NOTIFICATIONS);
    this.currentRole = 'public'; // 'public', 'patient', 'doctor', 'admin'
    this.currentPatientTab = 'home'; // 'home', 'explore', 'appointments', 'messages', 'profile'
    this.selectedClinicId = 'clinic-1';
    this.selectedDoctor = null;
    this.bookingDraft = {
      step: 1,
      service: 'Cardiology',
      doctor: 'Dr. Sarah Ramos, MD',
      clinic: 'St. Jude Medical Center — Downtown Main Campus',
      type: 'Telehealth',
      date: '2026-10-08',
      time: '10:30 AM',
      patientName: 'Mariane Millera',
      email: 'mariane.millera@gmail.com',
      phone: '+1 (555) 019-2834',
      reason: ''
    };
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('Storage read exception, using fallback', e);
      return fallback;
    }
  }

  saveAppointments() {
    try {
      localStorage.setItem('healthcare_appts', JSON.stringify(this.appointments));
    } catch (e) {
      console.warn('Storage save exception', e);
    }
  }

  saveNotifications() {
    try {
      localStorage.setItem('healthcare_notifs', JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('Storage save exception', e);
    }
  }

  addAppointment(appt) {
    this.appointments.unshift(appt);
    this.saveAppointments();
  }

  updateAppointmentStatus(id, newStatus, clinicalNotes = null) {
    this.appointments = this.appointments.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: newStatus,
          notes: clinicalNotes !== null ? clinicalNotes : a.notes
        };
      }
      return a;
    });
    this.saveAppointments();
  }

  rescheduleAppointment(id, newDate, newTime) {
    this.appointments = this.appointments.map(a => {
      if (a.id === id) {
        return { ...a, date: newDate, time: newTime, status: 'approved' };
      }
      return a;
    });
    this.saveAppointments();
  }
}

// Global Application Instance
window.HC_STORE = new HealthcareStore();

// ============================================================================
// 2. LEAFLET INTERACTIVE MAP & SPATIAL INTEGRATION
// ============================================================================
let leafletMapInstance = null;
let clinicMarkers = {};

function initSpatialMap() {
  const mapElem = document.getElementById('spatial-map');
  if (!mapElem) return;

  // Check if Leaflet is loaded
  if (typeof L === 'undefined') {
    renderFallbackVectorMap(mapElem);
    return;
  }

  try {
    // Center at Midtown Manhattan
    if (!leafletMapInstance) {
      leafletMapInstance = L.map('spatial-map', {
        center: [40.7589, -73.9780],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Positron pale icy tiles matching the reference image aesthetic
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(leafletMapInstance);

      // Add custom zoom control in bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(leafletMapInstance);

      // Add pins for all clinics
      CLINICS_DATA.forEach(clinic => {
        const customIcon = L.divIcon({
          className: 'custom-map-pin-wrap',
          html: `
            <div class="custom-clinic-pin" id="pin-${clinic.id}" onclick="selectClinicOnMap('${clinic.id}')">
              <div class="pin-beacon"></div>
              <div class="pin-core">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 21s-6-5.33-6-10a6 6 0 0 1 12 0c0 4.67-6 10-6 10z"/>
                  <circle cx="12" cy="11" r="2"/>
                </svg>
              </div>
            </div>
          `,
          iconSize: [36, 42],
          iconAnchor: [18, 42]
        });

        const marker = L.marker([clinic.lat, clinic.lng], { icon: customIcon }).addTo(leafletMapInstance);
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <strong style="font-size: 0.875rem; color: #0f172a;">${clinic.name}</strong>
            <p style="font-size: 0.75rem; color: #64748b; margin: 4px 0 8px;">${clinic.address}</p>
            <div style="font-size: 0.75rem; color: #2563eb; font-weight: 600;">Distance: ${clinic.distance}</div>
            <button onclick="openBookingWithClinic('${clinic.id}')" style="margin-top: 8px; width: 100%; padding: 6px 10px; background: #2563eb; color: #fff; border-radius: 8px; border: none; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
              Book at this Clinic
            </button>
          </div>
        `);
        clinicMarkers[clinic.id] = marker;
      });
    }

    // Force map recalculate container size
    setTimeout(() => {
      if (leafletMapInstance) leafletMapInstance.invalidateSize();
    }, 200);

  } catch (err) {
    console.warn('Leaflet map initialization notice:', err);
    renderFallbackVectorMap(mapElem);
  }
}

function renderFallbackVectorMap(container) {
  container.innerHTML = `
    <div style="width: 100%; height: 100%; background: #e2eaf4; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; padding: 20px; text-align: center;">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="1.5" style="margin-bottom: 12px;">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/>
        <line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
      <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a;">Metro Healthcare Map View</h3>
      <p style="font-size: 0.8125rem; color: #64748b; max-width: 320px; margin-top: 4px;">
        4 Accredited Medical Centers Active in Manhattan & Surrounding Areas.
      </p>
      <div style="display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; justify-content: center;">
        <span class="status-badge confirmed" style="cursor: pointer;" onclick="selectClinicOnMap('clinic-1')">📍 St. Jude Medical (0.8 mi)</span>
        <span class="status-badge confirmed" style="cursor: pointer;" onclick="selectClinicOnMap('clinic-2')">📍 Metropolitan Health (1.2 mi)</span>
      </div>
    </div>
  `;
}

function selectClinicOnMap(clinicId) {
  window.HC_STORE.selectedClinicId = clinicId;
  const clinic = CLINICS_DATA.find(c => c.id === clinicId);
  if (!clinic) return;

  if (leafletMapInstance) {
    leafletMapInstance.flyTo([clinic.lat, clinic.lng], 15, { duration: 1.2 });
    if (clinicMarkers[clinicId]) {
      clinicMarkers[clinicId].openPopup();
    }
  }

  // Update selected clinic UI preview card
  renderClinicPreviewCard(clinic);
}

function renderClinicPreviewCard(clinic) {
  const container = document.getElementById('selected-clinic-preview');
  if (!container) return;

  container.innerHTML = `
    <div class="clinic-card selected" style="margin-top: 14px; animation: fadeInStep 0.2s ease;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <span style="font-size: 0.6875rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase;">Selected Facility</span>
          <div class="clinic-title" style="margin-top: 2px;">${clinic.name}</div>
          <div class="clinic-address">${clinic.address} • <strong>${clinic.distance} away</strong></div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${clinic.hours}</div>
        </div>
        <button class="bubble-btn bubble-btn-primary" style="padding: 6px 14px; font-size: 0.8125rem;" onclick="openBookingWithClinic('${clinic.id}')">
          Book Here
        </button>
      </div>
    </div>
  `;
}

// "Use My Location" Geolocation API Handler
function requestUserLocation() {
  const locTag = document.getElementById('location-display-text');
  if (navigator.geolocation) {
    if (locTag) locTag.textContent = 'Locating...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (leafletMapInstance) {
          leafletMapInstance.flyTo([latitude, longitude], 14, { duration: 1.2 });
          // Add user pin marker
          L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#2563eb',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(leafletMapInstance).bindPopup('You are here').openPopup();
        }
        if (locTag) locTag.textContent = 'Near Current Location';
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err.message);
        if (locTag) locTag.textContent = 'Midtown Manhattan, NY';
        alert('Location access was denied or unavailable. Showing Manhattan clinics.');
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
}

// ============================================================================
// 3. ROLE NAVIGATION & SUB-VIEWS
// ============================================================================

function switchRole(roleKey) {
  window.HC_STORE.currentRole = roleKey;

  // Header pills
  document.querySelectorAll('.nav-role-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-role') === roleKey);
  });

  // Mobile dock items
  document.querySelectorAll('.dock-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-role') === roleKey);
  });

  // Role sections
  document.querySelectorAll('.role-view-container').forEach(view => {
    view.classList.remove('active');
    if (view.id === `role-view-${roleKey}`) {
      view.classList.add('active');
    }
  });

  // Invalidate map size if entering public or explore
  if (roleKey === 'public' || roleKey === 'patient') {
    setTimeout(() => {
      if (leafletMapInstance) leafletMapInstance.invalidateSize();
    }, 150);
  }

  // Rerender active view data
  renderAllViews();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Patient View internal tab switching
function switchPatientTab(tabKey) {
  window.HC_STORE.currentPatientTab = tabKey;
  document.querySelectorAll('.patient-tab-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-tab') === tabKey);
  });
  document.querySelectorAll('.patient-subview').forEach(v => {
    v.style.display = (v.id === `patient-subview-${tabKey}`) ? 'block' : 'none';
  });

  if (tabKey === 'explore') {
    setTimeout(() => {
      if (leafletMapInstance) leafletMapInstance.invalidateSize();
    }, 150);
  }
}

// ============================================================================
// 4. RENDERING ALL SECTIONS
// ============================================================================

function renderAllViews() {
  renderPatientDashboard();
  renderAppointmentsList();
  renderDoctorCards();
  renderClinicsList();
  renderDoctorQueue();
  renderAdminDashboard();
  renderNotifications();
  if (window.lucide) window.lucide.createIcons();
}

// Patient View Rendering
function renderPatientDashboard() {
  const store = window.HC_STORE;
  const appts = store.appointments;

  // Find next upcoming appointment
  const nextAppt = appts.find(a => a.status === 'approved' || a.status === 'pending');
  const nextCardContainer = document.getElementById('patient-next-appt-card');

  if (nextCardContainer) {
    if (nextAppt) {
      const dateParts = nextAppt.date.split('-');
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthStr = monthNames[parseInt(dateParts[1], 10) - 1] || 'Oct';
      const dayStr = dateParts[2] || '08';

      nextCardContainer.innerHTML = `
        <div class="next-appointment-card">
          <div class="next-card-content">
            <div class="next-date-badge">
              <span class="next-date-month">${monthStr}</span>
              <span class="next-date-day">${dayStr}</span>
            </div>
            <div class="next-info-wrap">
              <div class="next-label-pill">
                <i data-lucide="calendar" style="width: 12px; height: 12px;"></i> Next Consultation
              </div>
              <div class="next-doctor-title">${nextAppt.doctor}</div>
              <div class="next-meta-row">
                <span><strong>Specialty:</strong> ${nextAppt.specialty}</span>
                <span>•</span>
                <span><strong>Time:</strong> ${nextAppt.time}</span>
                <span>•</span>
                <span><strong>Type:</strong> ${nextAppt.type}</span>
              </div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                <i data-lucide="map-pin" style="width: 12px; height: 12px; vertical-align: middle;"></i> ${nextAppt.clinic}
              </div>
            </div>
            <div class="next-actions-group">
              ${nextAppt.type === 'Telehealth' ? `
                <button class="bubble-btn bubble-btn-primary" onclick="openTelehealthRoom(${nextAppt.id})">
                  <i data-lucide="video" style="width: 14px; height: 14px;"></i> Join Telehealth
                </button>
              ` : `
                <button class="bubble-btn bubble-btn-primary" onclick="getDirections('${encodeURIComponent(nextAppt.clinic)}')">
                  <i data-lucide="navigation" style="width: 14px; height: 14px;"></i> Directions
                </button>
              `}
              <button class="bubble-btn bubble-btn-subtle" onclick="openRescheduleModal(${nextAppt.id})">
                Reschedule
              </button>
            </div>
          </div>
        </div>
      `;
    } else {
      nextCardContainer.innerHTML = `
        <div class="next-appointment-card" style="text-align: center; padding: 32px 20px;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;">
            <i data-lucide="calendar-check" style="width: 24px; height: 24px;"></i>
          </div>
          <h3 style="font-size: 1.0625rem; font-weight: 700; color: #0f172a;">No Consultations Scheduled</h3>
          <p style="font-size: 0.8125rem; color: #64748b; margin-top: 4px;">
            Book an in-person or telehealth visit with our accredited specialists.
          </p>
          <button class="bubble-btn bubble-btn-primary" style="margin-top: 14px;" onclick="openGuidedBookingModal()">
            <i data-lucide="plus" style="width: 14px; height: 14px;"></i> Schedule an Appointment
          </button>
        </div>
      `;
    }
  }

  // Update counts on Metric Bubble Bar
  const activeCount = appts.filter(a => a.status === 'approved' || a.status === 'pending').length;
  const completedCount = appts.filter(a => a.status === 'completed').length;
  const activeCountElem = document.getElementById('patient-active-appts-metric');
  if (activeCountElem) activeCountElem.textContent = `${activeCount} Upcoming`;

  const doneCountElem = document.getElementById('patient-completed-appts-metric');
  if (doneCountElem) doneCountElem.textContent = `${completedCount} Records`;
}

// Appointments List with filter (Upcoming, Completed, Cancelled)
let activeApptFilter = 'upcoming';

function filterAppointments(filterKey) {
  activeApptFilter = filterKey;
  document.querySelectorAll('.filter-tab-pill').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-filter') === filterKey);
  });
  renderAppointmentsList();
}

function renderAppointmentsList() {
  const container = document.getElementById('patient-appointments-list');
  if (!container) return;

  const appts = window.HC_STORE.appointments.filter(a => {
    if (activeApptFilter === 'upcoming') return a.status === 'approved' || a.status === 'pending';
    if (activeApptFilter === 'completed') return a.status === 'completed';
    if (activeApptFilter === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  if (appts.length === 0) {
    container.innerHTML = `
      <div style="background: #ffffff; border-radius: var(--radius-lg); border: 1px dashed var(--border-strong); padding: 40px 20px; text-align: center;">
        <i data-lucide="inbox" style="width: 36px; height: 36px; color: var(--text-muted); margin-bottom: 8px;"></i>
        <div style="font-weight: 700; color: var(--text-primary); font-size: 0.9375rem;">No appointments found in this category</div>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 4px;">Schedule a new visit or check other tabs.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = appts.map(a => {
    const dateParts = a.date.split('-');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mo = monthNames[parseInt(dateParts[1], 10) - 1] || 'Oct';
    const day = dateParts[2] || '08';

    return `
      <div class="appointment-item-card">
        <div class="appointment-left-col">
          <div class="appointment-date-pill">
            <span class="app-date-mo">${mo}</span>
            <span class="app-date-num">${day}</span>
          </div>
          <div class="app-details-col">
            <div class="app-doc-name">${a.doctor}</div>
            <div class="app-spec-tag">${a.specialty} • ${a.type}</div>
            <div class="app-meta-text">
              <span><i data-lucide="clock" style="width: 12px; height: 12px;"></i> ${a.time}</span>
              <span>•</span>
              <span><i data-lucide="map-pin" style="width: 12px; height: 12px;"></i> ${a.clinic}</span>
            </div>
            ${a.reason ? `<div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 6px; font-style: italic;">"${a.reason}"</div>` : ''}
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
          <span class="status-badge ${a.status}">${a.status}</span>
          <div style="display: flex; gap: 6px;">
            <button class="bubble-btn bubble-btn-subtle" style="padding: 6px 12px; font-size: 0.75rem;" onclick="downloadIcsCalendar(${a.id})">
              <i data-lucide="calendar-plus" style="width: 12px; height: 12px;"></i> .ICS
            </button>
            ${a.status !== 'cancelled' && a.status !== 'completed' ? `
              <button class="bubble-btn bubble-btn-subtle" style="padding: 6px 12px; font-size: 0.75rem;" onclick="openRescheduleModal(${a.id})">
                Reschedule
              </button>
              <button class="bubble-btn bubble-btn-subtle" style="padding: 6px 12px; font-size: 0.75rem; color: var(--status-cancelled-text);" onclick="cancelAppointment(${a.id})">
                Cancel
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// Doctor Discovery Cards
let doctorSearchQuery = '';
let doctorSpecialtyFilter = 'all';

function filterDoctors(spec) {
  doctorSpecialtyFilter = spec;
  document.querySelectorAll('.spec-filter-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-spec') === spec);
  });
  renderDoctorCards();
}

function handleDoctorSearch(query) {
  doctorSearchQuery = query.toLowerCase().trim();
  renderDoctorCards();
}

function renderDoctorCards() {
  const container = document.getElementById('featured-doctors-grid');
  if (!container) return;

  const docs = DOCTORS_DATA.filter(doc => {
    const matchesSpec = (doctorSpecialtyFilter === 'all') || (doc.specialty === doctorSpecialtyFilter);
    const matchesSearch = !doctorSearchQuery ||
      doc.name.toLowerCase().includes(doctorSearchQuery) ||
      doc.specialty.toLowerCase().includes(doctorSearchQuery) ||
      doc.clinicName.toLowerCase().includes(doctorSearchQuery);
    return matchesSpec && matchesSearch;
  });

  if (docs.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border-strong);">
        <i data-lucide="user-x" style="width: 36px; height: 36px; color: var(--text-muted); margin-bottom: 8px;"></i>
        <div style="font-weight: 700; color: var(--text-primary);">No Specialists Found</div>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 4px;">Try searching for another specialty or clear the filter.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = docs.map(doc => `
    <div class="modern-doctor-card" onclick="openDoctorProfileModal('${doc.id}')">
      <div class="doc-card-photo-box">
        <img src="${doc.photo}" alt="${doc.name}" class="doc-card-img" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=2563eb&color=fff'">
        <div class="doc-badge-floating">
          <i data-lucide="star" style="width: 12px; height: 12px; fill: #f59e0b; color: #f59e0b;"></i>
          <span>${doc.rating}</span>
        </div>
      </div>
      <div class="doc-card-content">
        <div>
          <div class="doc-name">${doc.name}</div>
          <div class="doc-specialty">${doc.subSpecialty}</div>
          <div class="doc-info-list">
            <div class="doc-info-row">
              <i data-lucide="shield-check" style="width: 13px; height: 13px;"></i>
              <span>License: ${doc.license} • ${doc.experience}</span>
            </div>
            <div class="doc-info-row">
              <i data-lucide="clock" style="width: 13px; height: 13px;"></i>
              <span>${doc.hours}</span>
            </div>
            <div class="doc-info-row">
              <i data-lucide="building" style="width: 13px; height: 13px;"></i>
              <span>${doc.clinicName}</span>
            </div>
          </div>
        </div>

        <div class="doc-card-footer">
          <div style="font-size: 0.75rem; font-weight: 700; color: #10b981;">
            <i data-lucide="video" style="width: 12px; height: 12px; vertical-align: middle;"></i> Telehealth & Clinic
          </div>
          <button class="bubble-btn bubble-btn-primary" style="padding: 6px 14px; font-size: 0.75rem;" onclick="event.stopPropagation(); startBookingWithDoctor('${doc.name}', '${doc.specialty}', '${doc.clinicName}')">
            Book
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

// Clinics list
function renderClinicsList() {
  const container = document.getElementById('clinics-selection-grid');
  if (!container) return;

  container.innerHTML = CLINICS_DATA.map(c => `
    <div class="clinic-card ${c.id === window.HC_STORE.selectedClinicId ? 'selected' : ''}" onclick="selectClinicOnMap('${c.id}')">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
          <div class="clinic-title">${c.name}</div>
          <div class="clinic-address">${c.address}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${c.hours}</div>
        </div>
        <span class="clinic-distance">${c.distance}</span>
      </div>
      <div style="margin-top: 10px; display: flex; gap: 6px; flex-wrap: wrap;">
        ${c.specialties.slice(0, 3).map(s => `<span class="status-badge" style="background: #eff6ff; color: #2563eb; font-size: 0.6875rem;">${s}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

// Doctor Schedule & Queue View
function renderDoctorQueue() {
  const container = document.getElementById('doctor-schedule-tbody');
  if (!container) return;

  const appts = window.HC_STORE.appointments;
  container.innerHTML = appts.map(a => `
    <tr>
      <td>
        <strong>${a.patientName}</strong>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${a.email} • ${a.phone}</div>
      </td>
      <td>
        <strong>${a.date}</strong>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${a.time}</div>
      </td>
      <td>
        <span class="status-badge" style="background: #eff6ff; color: #2563eb;">${a.specialty}</span>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${a.type}</div>
      </td>
      <td style="max-width: 240px; font-size: 0.8125rem;">
        ${a.reason || 'General health consultation'}
      </td>
      <td><span class="status-badge ${a.status}">${a.status}</span></td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 4px;">
          ${a.status === 'pending' ? `
            <button class="bubble-btn bubble-btn-primary" style="padding: 5px 10px; font-size: 0.75rem;" onclick="updateAppointmentState(${a.id}, 'approved')">Approve</button>
          ` : a.status === 'approved' ? `
            <button class="bubble-btn bubble-btn-subtle" style="padding: 5px 10px; font-size: 0.75rem;" onclick="openClinicalNotesModal(${a.id})">Notes</button>
            <button class="bubble-btn bubble-btn-primary" style="padding: 5px 10px; font-size: 0.75rem;" onclick="updateAppointmentState(${a.id}, 'completed')">Complete</button>
          ` : `
            <span style="font-size: 0.75rem; color: var(--text-muted);">Recorded</span>
          `}
        </div>
      </td>
    </tr>
  `).join('');

  // Doctor metrics
  const activeCount = appts.filter(a => a.status === 'approved' || a.status === 'pending').length;
  const completedCount = appts.filter(a => a.status === 'completed').length;
  const docQueueElem = document.getElementById('doctor-metric-queue');
  if (docQueueElem) docQueueElem.textContent = activeCount;
  const docDoneElem = document.getElementById('doctor-metric-done');
  if (docDoneElem) docDoneElem.textContent = completedCount;
}

// Admin System Rendering
function renderAdminDashboard() {
  const container = document.getElementById('admin-appointments-tbody');
  if (!container) return;

  const appts = window.HC_STORE.appointments;
  container.innerHTML = appts.map(a => `
    <tr>
      <td><strong>${a.refCode}</strong></td>
      <td>${a.patientName}</td>
      <td>${a.doctor}</td>
      <td>${a.specialty}</td>
      <td>${a.date} • ${a.time}</td>
      <td><span class="status-badge ${a.status}">${a.status}</span></td>
      <td style="text-align: right;">
        <select onchange="updateAppointmentState(${a.id}, this.value)" style="padding: 4px 8px; border-radius: 8px; border: 1px solid var(--border-subtle); font-size: 0.75rem;">
          <option value="pending" ${a.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="approved" ${a.status === 'approved' ? 'selected' : ''}>Approved</option>
          <option value="completed" ${a.status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="cancelled" ${a.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
    </tr>
  `).join('');

  const adminTotalElem = document.getElementById('admin-metric-total');
  if (adminTotalElem) adminTotalElem.textContent = appts.length;
}

// Notifications Drawer
function renderNotifications() {
  const list = document.getElementById('notifications-list');
  const countBadge = document.getElementById('notif-badge-count');
  if (!list) return;

  const notifs = window.HC_STORE.notifications;
  const unreadCount = notifs.filter(n => !n.read).length;

  if (countBadge) {
    countBadge.textContent = unreadCount;
    countBadge.style.display = unreadCount > 0 ? 'block' : 'none';
  }

  list.innerHTML = notifs.map(n => `
    <div style="padding: 12px 14px; border-bottom: 1px solid var(--border-subtle); background: ${n.read ? '#fff' : '#f0fdf4'}; display: flex; gap: 10px; align-items: flex-start;">
      <div style="width: 8px; height: 8px; border-radius: 50%; background: ${n.read ? 'transparent' : '#10b981'}; margin-top: 6px; flex-shrink: 0;"></div>
      <div style="flex: 1;">
        <div style="font-size: 0.8125rem; font-weight: 700; color: var(--text-primary);">${n.title}</div>
        <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">${n.message}</div>
        <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 4px;">${n.time}</div>
      </div>
    </div>
  `).join('');
}

function markAllNotificationsRead() {
  window.HC_STORE.notifications = window.HC_STORE.notifications.map(n => ({ ...n, read: true }));
  window.HC_STORE.saveNotifications();
  renderNotifications();
}

function toggleNotificationsTray() {
  const tray = document.getElementById('notifications-tray-modal');
  if (tray) tray.classList.toggle('active');
}

// ============================================================================
// 5. GUIDED 10-STEP BOOKING FLOW WIZARD
// ============================================================================

function openGuidedBookingModal() {
  window.HC_STORE.bookingDraft.step = 1;
  updateBookingWizardUI();
  const modal = document.getElementById('booking-wizard-modal');
  if (modal) modal.classList.add('active');
}

function closeGuidedBookingModal() {
  const modal = document.getElementById('booking-wizard-modal');
  if (modal) modal.classList.remove('active');
}

function startBookingWithDoctor(docName, specialty, clinicName) {
  window.HC_STORE.bookingDraft.doctor = docName;
  window.HC_STORE.bookingDraft.service = specialty;
  window.HC_STORE.bookingDraft.clinic = clinicName;
  window.HC_STORE.bookingDraft.step = 4; // jump to consultation type
  updateBookingWizardUI();
  const modal = document.getElementById('booking-wizard-modal');
  if (modal) modal.classList.add('active');
}

function openBookingWithClinic(clinicId) {
  const clinic = CLINICS_DATA.find(c => c.id === clinicId);
  if (clinic) {
    window.HC_STORE.bookingDraft.clinic = clinic.name;
    window.HC_STORE.bookingDraft.step = 1;
    updateBookingWizardUI();
    const modal = document.getElementById('booking-wizard-modal');
    if (modal) modal.classList.add('active');
  }
}

function nextBookingStep() {
  if (window.HC_STORE.bookingDraft.step < 10) {
    // Validate inputs
    if (window.HC_STORE.bookingDraft.step === 7) {
      const name = document.getElementById('wiz-patient-name')?.value;
      const email = document.getElementById('wiz-patient-email')?.value;
      const phone = document.getElementById('wiz-patient-phone')?.value;
      if (!name || !email || !phone) {
        alert('Please fill in required patient contact details.');
        return;
      }
      window.HC_STORE.bookingDraft.patientName = name;
      window.HC_STORE.bookingDraft.email = email;
      window.HC_STORE.bookingDraft.phone = phone;
    }
    if (window.HC_STORE.bookingDraft.step === 8) {
      const reason = document.getElementById('wiz-patient-reason')?.value || '';
      window.HC_STORE.bookingDraft.reason = reason;
    }
    if (window.HC_STORE.bookingDraft.step === 9) {
      // Confirm Booking
      finalizeBooking();
      return;
    }

    window.HC_STORE.bookingDraft.step++;
    updateBookingWizardUI();
  }
}

function prevBookingStep() {
  if (window.HC_STORE.bookingDraft.step > 1) {
    window.HC_STORE.bookingDraft.step--;
    updateBookingWizardUI();
  }
}

function setBookingDraftField(field, val) {
  window.HC_STORE.bookingDraft[field] = val;
  updateBookingWizardUI();
}

function updateBookingWizardUI() {
  const draft = window.HC_STORE.bookingDraft;
  const step = draft.step;

  // Update Stepper Indicators
  document.querySelectorAll('.wizard-step-node').forEach(node => {
    const s = parseInt(node.getAttribute('data-step'), 10);
    node.classList.toggle('active', s === step);
    node.classList.toggle('completed', s < step);
  });

  const stepFill = document.getElementById('stepper-fill');
  if (stepFill) {
    stepFill.style.width = `${((step - 1) / 9) * 100}%`;
  }

  // Render current step panel content
  const panel = document.getElementById('wizard-step-content');
  if (!panel) return;

  switch (step) {
    case 1:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 1: Choose Specialty & Service</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Select the clinical department for your visit.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px;">
          ${SERVICES_DATA.map(s => `
            <div class="clinic-card ${draft.service === s.name ? 'selected' : ''}" onclick="setBookingDraftField('service', '${s.name}')">
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.9375rem;">${s.title}</div>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${s.desc}</p>
              <div style="margin-top: 8px; font-size: 0.75rem; font-weight: 700; color: var(--accent-primary);">${s.fee} • ${s.time}</div>
            </div>
          `).join('')}
        </div>
      `;
      break;

    case 2:
      const eligibleDoctors = DOCTORS_DATA.filter(d => d.specialty === draft.service);
      const docsToShow = eligibleDoctors.length > 0 ? eligibleDoctors : DOCTORS_DATA;
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 2: Choose Specialist</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Physicians certified in ${draft.service}.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
          ${docsToShow.map(d => `
            <div class="clinic-card ${draft.doctor === d.name ? 'selected' : ''}" onclick="setBookingDraftField('doctor', '${d.name}')">
              <div style="display: flex; gap: 12px; align-items: center;">
                <img src="${d.photo}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2563eb&color=fff'">
                <div>
                  <div style="font-weight: 700; font-size: 0.9375rem;">${d.name}</div>
                  <div style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 600;">${d.subSpecialty}</div>
                  <div style="font-size: 0.6875rem; color: var(--text-muted);">★ ${d.rating} (${d.reviewsCount} reviews)</div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      break;

    case 3:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 3: Choose Clinic Facility</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Convenient locations with accredited clinical rooms.</p>
        <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
          ${CLINICS_DATA.map(c => `
            <div class="clinic-card ${draft.clinic === c.name ? 'selected' : ''}" onclick="setBookingDraftField('clinic', '${c.name}')">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; font-size: 0.9375rem;">${c.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${c.address}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${c.hours}</div>
                </div>
                <span class="status-badge" style="background: #eff6ff; color: #2563eb;">${c.distance}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
      break;

    case 4:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 4: Select Consultation Format</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Choose between virtual telemedicine or on-site consultation.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="clinic-card ${draft.type === 'Telehealth' ? 'selected' : ''}" onclick="setBookingDraftField('type', 'Telehealth')" style="text-align: center; padding: 24px 16px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
              <i data-lucide="video" style="width: 24px; height: 24px;"></i>
            </div>
            <div style="font-weight: 700;">Telehealth HD Video</div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Join securely from your smartphone or laptop from home.</p>
          </div>

          <div class="clinic-card ${draft.type === 'In-Person' ? 'selected' : ''}" onclick="setBookingDraftField('type', 'In-Person')" style="text-align: center; padding: 24px 16px;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
              <i data-lucide="building" style="width: 24px; height: 24px;"></i>
            </div>
            <div style="font-weight: 700;">In-Person Clinic Visit</div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Meet at the accredited hospital suite for hands-on examination.</p>
          </div>
        </div>
      `;
      break;

    case 5:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 5: Pick Appointment Date</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Select an available clinical consultation day.</p>
        <div class="form-field" style="max-width: 320px;">
          <label class="form-label">Available Calendar Date</label>
          <input type="date" id="wiz-date-input" class="form-input" value="${draft.date}" min="2026-10-03" max="2026-11-30" onchange="setBookingDraftField('date', this.value)">
        </div>
        <div style="display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap;">
          <button class="bubble-btn bubble-btn-subtle" onclick="setBookingDraftField('date', '2026-10-08')">Oct 8 (Thu)</button>
          <button class="bubble-btn bubble-btn-subtle" onclick="setBookingDraftField('date', '2026-10-09')">Oct 9 (Fri)</button>
          <button class="bubble-btn bubble-btn-subtle" onclick="setBookingDraftField('date', '2026-10-12')">Oct 12 (Mon)</button>
          <button class="bubble-btn bubble-btn-subtle" onclick="setBookingDraftField('date', '2026-10-13')">Oct 13 (Tue)</button>
        </div>
      `;
      break;

    case 6:
      // Smart availability slots: check existing bookings for this doctor & date
      const bookedSlots = window.HC_STORE.appointments
        .filter(a => a.doctor === draft.doctor && a.date === draft.date && a.status !== 'cancelled')
        .map(a => a.time);

      const allSlots = ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '01:00 PM', '02:00 PM', '03:15 PM', '04:00 PM'];

      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 6: Smart Time Slot Availability</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 12px;">
          Real-time slot reservation for ${draft.doctor} on <strong>${draft.date}</strong>. Double bookings are automatically prevented.
        </p>
        <div class="time-slots-grid">
          ${allSlots.map(slot => {
            const isBooked = bookedSlots.includes(slot);
            const isSelected = draft.time === slot;
            return `
              <div class="time-slot-pill ${isSelected ? 'selected' : ''} ${isBooked ? 'disabled' : ''}"
                   onclick="${!isBooked ? `setBookingDraftField('time', '${slot}')` : ''}"
                   title="${isBooked ? 'Slot already reserved by another patient' : 'Available for booking'}">
                ${slot}
                ${isBooked ? '<div style="font-size: 0.625rem; color: #ef4444;">Booked</div>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
      break;

    case 7:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 7: Patient Details</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Verify your identity and primary contact records.</p>
        <div class="form-grid-2">
          <div class="form-field">
            <label class="form-label">Full Name *</label>
            <input type="text" id="wiz-patient-name" class="form-input" value="${draft.patientName}" placeholder="e.g. Mariane Millera">
          </div>
          <div class="form-field">
            <label class="form-label">Email Address *</label>
            <input type="email" id="wiz-patient-email" class="form-input" value="${draft.email}" placeholder="patient@gmail.com">
          </div>
          <div class="form-field">
            <label class="form-label">Contact Phone Number *</label>
            <input type="tel" id="wiz-patient-phone" class="form-input" value="${draft.phone}" placeholder="+1 (555) 019-2834">
          </div>
          <div class="form-field">
            <label class="form-label">Insurance Provider / Self-Pay</label>
            <input type="text" class="form-input" value="Blue Cross Blue Shield (PPO)" placeholder="Optional insurance policy ID">
          </div>
        </div>
      `;
      break;

    case 8:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 8: Consultation Reason & Symptoms</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 14px;">Help the medical staff prepare clinical diagnostics.</p>
        <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
          <button type="button" class="bubble-btn bubble-btn-subtle" onclick="document.getElementById('wiz-patient-reason').value += 'Routine Cardiovascular Checkup. '">Cardio Checkup</button>
          <button type="button" class="bubble-btn bubble-btn-subtle" onclick="document.getElementById('wiz-patient-reason').value += 'Mild chest discomfort after exercise. '">Chest Discomfort</button>
          <button type="button" class="bubble-btn bubble-btn-subtle" onclick="document.getElementById('wiz-patient-reason').value += 'Prescription Refill & Lab Review. '">Prescription Refill</button>
        </div>
        <div class="form-field">
          <textarea id="wiz-patient-reason" class="form-textarea" rows="4" placeholder="Detail symptoms, duration, current medications, or notes for the doctor...">${draft.reason}</textarea>
        </div>
      `;
      break;

    case 9:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 9: Review Booking Summary</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Please review your appointment schedule details before confirmation.</p>
        <div class="clinic-card" style="padding: 20px; background: #f8fafc;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div>
              <span class="metric-label">Specialist</span>
              <div style="font-weight: 700; font-size: 1rem; color: #0f172a;">${draft.doctor}</div>
              <div style="font-size: 0.8125rem; color: #2563eb;">${draft.service}</div>
            </div>
            <div>
              <span class="metric-label">Date & Time</span>
              <div style="font-weight: 700; font-size: 1rem; color: #0f172a;">${draft.date} • ${draft.time}</div>
              <div style="font-size: 0.8125rem; color: #10b981;">Format: ${draft.type}</div>
            </div>
            <div>
              <span class="metric-label">Facility</span>
              <div style="font-weight: 700; font-size: 0.9375rem; color: #0f172a;">${draft.clinic}</div>
            </div>
            <div>
              <span class="metric-label">Patient Record</span>
              <div style="font-weight: 700; font-size: 0.9375rem; color: #0f172a;">${draft.patientName}</div>
              <div style="font-size: 0.75rem; color: #64748b;">${draft.email}</div>
            </div>
          </div>
          ${draft.reason ? `
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border-subtle); font-size: 0.8125rem; color: #334155;">
              <strong>Chief Complaint:</strong> ${draft.reason}
            </div>
          ` : ''}
        </div>
      `;
      break;

    case 10:
      panel.innerHTML = `
        <div style="text-align: center; padding: 24px 16px;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px;">
            <i data-lucide="check-circle" style="width: 32px; height: 32px;"></i>
          </div>
          <h2 style="font-size: 1.375rem; font-weight: 800; color: #0f172a;">Appointment Confirmed!</h2>
          <div style="font-size: 0.875rem; font-weight: 700; color: #2563eb; margin: 6px 0 16px;">
            Reference ID: ${draft.refCode || 'APT-2026-9284'}
          </div>
          <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto 20px;">
            Your clinical consultation with <strong>${draft.doctor}</strong> is scheduled for <strong>${draft.date} at ${draft.time}</strong> (${draft.type}). A calendar invite and SMS confirmation have been prepared.
          </p>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="bubble-btn bubble-btn-primary" onclick="downloadIcsCalendar('new')">
              <i data-lucide="calendar-plus" style="width: 14px; height: 14px;"></i> Add to Calendar (.ICS)
            </button>
            <button class="bubble-btn bubble-btn-subtle" onclick="closeGuidedBookingModal(); switchRole('patient');">
              View in My Appointments
            </button>
          </div>
        </div>
      `;
      break;
  }

  // Footer button states
  const prevBtn = document.getElementById('wiz-prev-btn');
  const nextBtn = document.getElementById('wiz-next-btn');
  if (prevBtn) prevBtn.style.display = (step === 1 || step === 10) ? 'none' : 'inline-flex';
  if (nextBtn) {
    if (step === 9) {
      nextBtn.textContent = 'Confirm & Finalize Booking';
      nextBtn.style.display = 'inline-flex';
    } else if (step === 10) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.textContent = 'Continue';
      nextBtn.style.display = 'inline-flex';
    }
  }

  if (window.lucide) window.lucide.createIcons();
}

function finalizeBooking() {
  const draft = window.HC_STORE.bookingDraft;
  const newRef = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const newAppt = {
    id: Date.now(),
    refCode: newRef,
    patientName: draft.patientName,
    email: draft.email,
    phone: draft.phone,
    doctor: draft.doctor,
    specialty: draft.service,
    clinic: draft.clinic,
    clinicAddress: draft.clinic,
    date: draft.date,
    time: draft.time,
    type: draft.type,
    status: 'approved',
    reason: draft.reason,
    notes: ''
  };

  draft.refCode = newRef;
  window.HC_STORE.addAppointment(newAppt);

  // Add confirmation notification
  window.HC_STORE.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Consultation Confirmed',
    message: `Scheduled with ${newAppt.doctor} on ${newAppt.date} at ${newAppt.time}.`,
    time: 'Just now',
    read: false,
    type: 'appointment'
  });
  window.HC_STORE.saveNotifications();

  draft.step = 10;
  updateBookingWizardUI();
  renderAllViews();

  // Trigger web notification if granted
  if (Notification && Notification.permission === 'granted') {
    new Notification('Appointment Confirmed', {
      body: `Your consultation with ${newAppt.doctor} on ${newAppt.date} at ${newAppt.time} is booked!`,
      icon: 'assets/icons/icon-192.png'
    });
  }
}

// ============================================================================
// 6. APPOINTMENT ACTIONS: .ICS CALENDAR, CANCEL, RESCHEDULE, TELEHEALTH ROOM
// ============================================================================

function downloadIcsCalendar(apptId) {
  let appt;
  if (apptId === 'new') {
    appt = window.HC_STORE.bookingDraft;
  } else {
    appt = window.HC_STORE.appointments.find(a => a.id === apptId);
  }
  if (!appt) return;

  const dateClean = appt.date.replace(/-/g, '');
  const startTime = dateClean + 'T143000Z';
  const endTime = dateClean + 'T151500Z';

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Healthcare System//Clinical Appointment//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Medical Consultation with ${appt.doctor}
DESCRIPTION:Healthcare appointment for ${appt.service || appt.specialty}. Format: ${appt.type}. Reference: ${appt.refCode || 'APT-2026'}
LOCATION:${appt.clinic}
DTSTART:${startTime}
DTEND:${endTime}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Consultation-${appt.date}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function cancelAppointment(id) {
  if (confirm('Are you sure you want to cancel this consultation? Your reserved slot will be released.')) {
    window.HC_STORE.updateAppointmentStatus(id, 'cancelled');
    renderAllViews();
  }
}

let activeRescheduleId = null;
function openRescheduleModal(id) {
  activeRescheduleId = id;
  const modal = document.getElementById('reschedule-modal');
  if (modal) modal.classList.add('active');
}

function closeRescheduleModal() {
  const modal = document.getElementById('reschedule-modal');
  if (modal) modal.classList.remove('active');
  activeRescheduleId = null;
}

function submitReschedule() {
  const newDate = document.getElementById('reschedule-date-input')?.value;
  const newTime = document.getElementById('reschedule-time-input')?.value;
  if (newDate && newTime && activeRescheduleId) {
    window.HC_STORE.rescheduleAppointment(activeRescheduleId, newDate, newTime);
    closeRescheduleModal();
    renderAllViews();
    alert(`Appointment rescheduled to ${newDate} at ${newTime}.`);
  }
}

// Telehealth Video Consultation Demo Modal
function openTelehealthRoom(apptId) {
  const appt = window.HC_STORE.appointments.find(a => a.id === apptId);
  const modal = document.getElementById('telehealth-room-modal');
  const title = document.getElementById('telehealth-doc-name');
  if (title && appt) title.textContent = appt.doctor;
  if (modal) modal.classList.add('active');
}

function closeTelehealthRoom() {
  const modal = document.getElementById('telehealth-room-modal');
  if (modal) modal.classList.remove('active');
}

function getDirections(destination) {
  window.open(`https://www.google.com/maps/search/?api=1&query=${destination}`, '_blank');
}

// Doctor Profile Modal
function openDoctorProfileModal(docId) {
  const doc = DOCTORS_DATA.find(d => d.id === docId);
  if (!doc) return;

  const modal = document.getElementById('doctor-profile-modal');
  const body = document.getElementById('doctor-profile-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
      <img src="${doc.photo}" alt="${doc.name}" style="width: 110px; height: 110px; border-radius: 20px; object-fit: cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(doc.name)}&background=2563eb&color=fff'">
      <div style="flex: 1; min-width: 220px;">
        <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">${doc.name}</h2>
        <div style="font-size: 0.875rem; font-weight: 600; color: #2563eb; margin-top: 2px;">${doc.subSpecialty}</div>
        <div style="display: flex; gap: 12px; margin-top: 8px; font-size: 0.75rem; color: #64748b; flex-wrap: wrap;">
          <span>★ <strong>${doc.rating}</strong> (${doc.reviewsCount} verified reviews)</span>
          <span>•</span>
          <span>License: ${doc.license}</span>
          <span>•</span>
          <span>${doc.experience}</span>
        </div>
      </div>
    </div>

    <div style="margin-top: 20px; padding: 14px; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px;">About the Specialist</div>
      <p style="font-size: 0.8125rem; color: #334155; line-height: 1.6;">${doc.bio}</p>
      <div style="margin-top: 8px; font-size: 0.75rem; color: #64748b;"><strong>Education:</strong> ${doc.education}</div>
    </div>

    <div style="margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div style="padding: 12px; background: #fff; border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--text-muted);">PRIMARY FACILITY</div>
        <div style="font-size: 0.8125rem; font-weight: 700; color: #0f172a; margin-top: 2px;">${doc.clinicName}</div>
      </div>
      <div style="padding: 12px; background: #fff; border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--text-muted);">CONSULTATION HOURS</div>
        <div style="font-size: 0.8125rem; font-weight: 700; color: #0f172a; margin-top: 2px;">${doc.hours}</div>
      </div>
    </div>

    <div style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 10px;">
      <button class="bubble-btn bubble-btn-subtle" onclick="closeDoctorProfileModal()">Close</button>
      <button class="bubble-btn bubble-btn-primary" onclick="closeDoctorProfileModal(); startBookingWithDoctor('${doc.name}', '${doc.specialty}', '${doc.clinicName}')">
        Book Appointment
      </button>
    </div>
  `;

  modal.classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}

function closeDoctorProfileModal() {
  const modal = document.getElementById('doctor-profile-modal');
  if (modal) modal.classList.remove('active');
}

// Clinical Notes Modal for Doctor View
let activeNotesApptId = null;
function openClinicalNotesModal(apptId) {
  activeNotesApptId = apptId;
  const appt = window.HC_STORE.appointments.find(a => a.id === apptId);
  const modal = document.getElementById('clinical-notes-modal');
  const textarea = document.getElementById('doctor-notes-textarea');
  if (textarea && appt) textarea.value = appt.notes || '';
  if (modal) modal.classList.add('active');
}

function closeClinicalNotesModal() {
  const modal = document.getElementById('clinical-notes-modal');
  if (modal) modal.classList.remove('active');
  activeNotesApptId = null;
}

function saveClinicalNotes() {
  const text = document.getElementById('doctor-notes-textarea')?.value;
  if (activeNotesApptId) {
    window.HC_STORE.updateAppointmentStatus(activeNotesApptId, 'approved', text);
    closeClinicalNotesModal();
    renderAllViews();
    alert('Clinical notes successfully updated on patient record.');
  }
}

function updateAppointmentState(apptId, status) {
  window.HC_STORE.updateAppointmentStatus(apptId, status);
  renderAllViews();
}

// Live Chat Simulator between Patient and Doctor
function sendPatientChatMessage() {
  const input = document.getElementById('chat-input-text');
  const messagesBox = document.getElementById('chat-messages-container');
  if (!input || !messagesBox || !input.value.trim()) return;

  const msg = input.value.trim();
  input.value = '';

  // Append user message
  messagesBox.innerHTML += `
    <div style="display: flex; justify-content: flex-end; margin-bottom: 10px;">
      <div style="background: #2563eb; color: #fff; padding: 10px 14px; border-radius: 18px 18px 4px 18px; max-width: 80%; font-size: 0.8125rem;">
        ${msg}
      </div>
    </div>
  `;
  messagesBox.scrollTop = messagesBox.scrollHeight;

  // Simulate doctor response after 1.2s
  setTimeout(() => {
    messagesBox.innerHTML += `
      <div style="display: flex; justify-content: flex-start; margin-bottom: 10px;">
        <div style="background: #e2eaf4; color: #0f172a; padding: 10px 14px; border-radius: 18px 18px 18px 4px; max-width: 80%; font-size: 0.8125rem;">
          Hello Mariane! Thank you for the update. I have reviewed your notes and will discuss this during our upcoming consultation.
        </div>
      </div>
    `;
    messagesBox.scrollTop = messagesBox.scrollHeight;
  }, 1200);
}

// ============================================================================
// 7. PWA SERVICE WORKER REGISTRATION & OFFLINE DETECTION
// ============================================================================

function initPWA() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('HealthCare Portal Service Worker registered successfully', reg.scope);
      })
      .catch(err => {
        console.warn('Service Worker registration note:', err);
      });
  }

  // Handle Online / Offline states
  const banner = document.getElementById('offline-indicator-banner');
  function updateNetworkStatus() {
    if (banner) {
      if (!navigator.onLine) {
        banner.classList.add('active');
      } else {
        banner.classList.remove('active');
      }
    }
  }

  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  updateNetworkStatus();

  // Custom PWA install banner prompt
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
      installBtn.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User installed the HealthCare PWA');
          }
          deferredPrompt = null;
          installBtn.style.display = 'none';
        });
      };
    }
  });
}

// Enable Browser Push Reminders
function requestPushReminders() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        alert('Push appointment reminders enabled! You will receive timely alerts.');
        new Notification('HealthCare Reminders Enabled', {
          body: 'You will receive reminders 24 hours and 1 hour before scheduled consultations.',
          icon: 'assets/icons/icon-192.png'
        });
      } else {
        alert('Notification permission was declined. In-app reminders will continue to work.');
      }
    });
  } else {
    alert('Browser notifications are not supported on this device.');
  }
}

// ============================================================================
// 8. GLOBAL INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initPWA();
  initSpatialMap();
  renderAllViews();

  // Attach search listeners
  const docSearchInput = document.getElementById('doctor-search-input');
  if (docSearchInput) {
    docSearchInput.addEventListener('input', (e) => handleDoctorSearch(e.target.value));
  }

  // Handle URL query parameters (e.g. ?role=patient or ?action=book)
  const urlParams = new URLSearchParams(window.location.search);
  const roleParam = urlParams.get('role');
  const actionParam = urlParams.get('action');
  if (roleParam && ['public', 'patient', 'doctor', 'admin'].includes(roleParam)) {
    switchRole(roleParam);
  }
  if (actionParam === 'book') {
    setTimeout(() => openGuidedBookingModal(), 200);
  }
});
