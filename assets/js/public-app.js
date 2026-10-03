/**
 * Public Discovery & Guided Booking Interaction Logic
 */

let leafletMap = null;
let clinicMarkers = {};

let bookingDraft = {
  step: 1,
  service: 'Cardiology',
  doctor: 'Dr. Sarah Ramos, MD',
  clinic: 'St. Jude Medical Center — Downtown Main Campus',
  type: 'Telehealth',
  date: '2026-10-08',
  time: '10:30 AM',
  patientName: '',
  email: '',
  phone: '',
  reason: ''
};

function initPublicMap() {
  const mapElem = document.getElementById('spatial-map');
  if (!mapElem) return;

  if (typeof L === 'undefined') {
    renderFallbackVectorMap(mapElem);
    return;
  }

  try {
    if (!leafletMap) {
      leafletMap = L.map('spatial-map', {
        center: [40.7589, -73.9780],
        zoom: 13,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(leafletMap);

      L.control.zoom({ position: 'bottomright' }).addTo(leafletMap);

      CLINICS_DATA.forEach(clinic => {
        const customIcon = L.divIcon({
          className: 'custom-map-pin-wrap',
          html: `
            <div class="custom-clinic-pin" id="pin-${clinic.id}" onclick="selectPublicClinic('${clinic.id}')">
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

        const marker = L.marker([clinic.lat, clinic.lng], { icon: customIcon }).addTo(leafletMap);
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 4px;">
            <strong style="font-size: 0.875rem; color: #0f172a;">${clinic.name}</strong>
            <p style="font-size: 0.75rem; color: #64748b; margin: 4px 0 8px;">${clinic.address}</p>
            <div style="font-size: 0.75rem; color: #2563eb; font-weight: 600;">Distance: ${clinic.distance}</div>
            <button onclick="openBookingWithClinic('${clinic.id}')" style="margin-top: 8px; width: 100%; padding: 6px 10px; background: #2563eb; color: #fff; border-radius: 8px; border: none; font-size: 0.75rem; font-weight: 600; cursor: pointer;">
              Book at this Facility
            </button>
          </div>
        `);
        clinicMarkers[clinic.id] = marker;
      });
    }

    setTimeout(() => {
      if (leafletMap) leafletMap.invalidateSize();
    }, 200);

  } catch (err) {
    renderFallbackVectorMap(mapElem);
  }
}

function renderFallbackVectorMap(container) {
  container.innerHTML = `
    <div style="width: 100%; height: 100%; background: #e2eaf4; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center;">
      <i data-lucide="map-pin" style="width: 36px; height: 36px; color: #2563eb; margin-bottom: 8px;"></i>
      <h3 style="font-size: 1rem; font-weight: 700; color: #0f172a;">Metropolitan Clinical Network</h3>
      <p style="font-size: 0.8125rem; color: #64748b; max-width: 320px; margin-top: 4px;">
        4 Accredited Medical Centers Active in Manhattan & Surrounding Areas.
      </p>
    </div>
  `;
}

function selectPublicClinic(clinicId) {
  const clinic = CLINICS_DATA.find(c => c.id === clinicId);
  if (!clinic) return;

  if (leafletMap) {
    leafletMap.flyTo([clinic.lat, clinic.lng], 15, { duration: 1.2 });
    if (clinicMarkers[clinicId]) clinicMarkers[clinicId].openPopup();
  }

  const container = document.getElementById('selected-clinic-preview');
  if (container) {
    container.innerHTML = `
      <div class="clinic-card selected" style="margin-top: 14px; animation: fadeInStep 0.2s ease;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <span style="font-size: 0.6875rem; font-weight: 700; color: var(--accent-primary); text-transform: uppercase;">Selected Facility</span>
            <div class="clinic-title" style="margin-top: 2px;">${clinic.name}</div>
            <div class="clinic-address">${clinic.address} • <strong>${clinic.distance} away</strong></div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${clinic.hours}</div>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="bubble-btn bubble-btn-subtle" style="padding: 6px 12px; font-size: 0.8125rem;" onclick="openClinicProfileModal('${clinic.id}')">
              Facility Details
            </button>
            <button class="bubble-btn bubble-btn-primary" style="padding: 6px 14px; font-size: 0.8125rem;" onclick="openBookingWithClinic('${clinic.id}')">
              Book Here
            </button>
          </div>
        </div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }
}

function requestUserLocation() {
  const locTag = document.getElementById('location-display-text');
  if (navigator.geolocation) {
    if (locTag) locTag.textContent = 'Locating...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (leafletMap) {
          leafletMap.flyTo([latitude, longitude], 14, { duration: 1.2 });
          L.circleMarker([latitude, longitude], {
            radius: 8,
            fillColor: '#2563eb',
            color: '#ffffff',
            weight: 3,
            fillOpacity: 0.9
          }).addTo(leafletMap).bindPopup('You are here').openPopup();
        }
        if (locTag) locTag.textContent = 'Near Current Location';
      },
      () => {
        if (locTag) locTag.textContent = 'Midtown Manhattan, NY';
        alert('Location access was denied. Showing Manhattan clinical network.');
      }
    );
  }
}

// Doctor Discovery
let doctorFilterSpec = 'all';
let doctorSearchQuery = '';

function filterDoctors(spec) {
  doctorFilterSpec = spec;
  document.querySelectorAll('.spec-filter-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-spec') === spec);
  });
  renderFeaturedDoctors();
}

function renderFeaturedDoctors() {
  const container = document.getElementById('featured-doctors-grid');
  if (!container) return;

  const docs = DOCTORS_DATA.filter(doc => {
    const matchSpec = (doctorFilterSpec === 'all') || (doc.specialty === doctorFilterSpec);
    const matchSearch = !doctorSearchQuery ||
      doc.name.toLowerCase().includes(doctorSearchQuery) ||
      doc.specialty.toLowerCase().includes(doctorSearchQuery) ||
      doc.clinicName.toLowerCase().includes(doctorSearchQuery);
    return matchSpec && matchSearch;
  });

  if (docs.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: #fff; border-radius: var(--radius-lg); border: 1px dashed var(--border-strong);">
        <i data-lucide="user-x" style="width: 36px; height: 36px; color: var(--text-muted); margin-bottom: 8px;"></i>
        <div style="font-weight: 700; color: var(--text-primary);">No Specialists Found</div>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 4px;">Try selecting another specialty or resetting search.</p>
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
            <i data-lucide="video" style="width: 12px; height: 12px; vertical-align: middle;"></i> Telehealth & In-Person
          </div>
          <button class="bubble-btn bubble-btn-primary" style="padding: 6px 14px; font-size: 0.75rem;" onclick="event.stopPropagation(); startBookingDoctor('${doc.name}', '${doc.specialty}', '${doc.clinicName}')">
            Book
          </button>
        </div>
      </div>
    </div>
  `).join('');

  if (window.lucide) window.lucide.createIcons();
}

function renderPublicClinics() {
  const container = document.getElementById('clinics-selection-grid');
  if (!container) return;

  container.innerHTML = CLINICS_DATA.map(c => `
    <div class="clinic-card" onclick="selectPublicClinic('${c.id}')">
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
          <span>★ <strong>${doc.rating}</strong> (${doc.reviewsCount} verified patient reviews)</span>
          <span>•</span>
          <span>License: ${doc.license}</span>
          <span>•</span>
          <span>${doc.experience}</span>
        </div>
      </div>
    </div>

    <div style="margin-top: 20px; padding: 14px; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px;">Physician Biography</div>
      <p style="font-size: 0.8125rem; color: #334155; line-height: 1.6;">${doc.bio}</p>
      <div style="margin-top: 8px; font-size: 0.75rem; color: #64748b;"><strong>Education:</strong> ${doc.education}</div>
      <div style="margin-top: 4px; font-size: 0.75rem; color: #64748b;"><strong>Languages:</strong> ${doc.languages.join(', ')}</div>
    </div>

    <div style="margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div style="padding: 12px; background: #fff; border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--text-muted);">AFFILIATED FACILITY</div>
        <div style="font-size: 0.8125rem; font-weight: 700; color: #0f172a; margin-top: 2px;">${doc.clinicName}</div>
      </div>
      <div style="padding: 12px; background: #fff; border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--text-muted);">CONSULTATION HOURS</div>
        <div style="font-size: 0.8125rem; font-weight: 700; color: #0f172a; margin-top: 2px;">${doc.hours}</div>
      </div>
    </div>

    <div style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 10px;">
      <button class="bubble-btn bubble-btn-subtle" onclick="closeDoctorProfileModal()">Close</button>
      <button class="bubble-btn bubble-btn-primary" onclick="closeDoctorProfileModal(); startBookingDoctor('${doc.name}', '${doc.specialty}', '${doc.clinicName}')">
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

// Clinic Profile Modal
function openClinicProfileModal(clinicId) {
  const clinic = CLINICS_DATA.find(c => c.id === clinicId);
  if (!clinic) return;

  const modal = document.getElementById('clinic-profile-modal');
  const body = document.getElementById('clinic-profile-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <h2 style="font-size: 1.25rem; font-weight: 800; color: #0f172a;">${clinic.name}</h2>
    <div style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 4px;">${clinic.address} • <strong>${clinic.distance} away</strong></div>
    
    <div style="margin-top: 16px; padding: 14px; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
      <p style="font-size: 0.8125rem; color: #334155; line-height: 1.6;">${clinic.description}</p>
      <div style="margin-top: 8px; font-size: 0.75rem; color: #64748b;"><strong>Accessibility:</strong> ${clinic.accessibility}</div>
    </div>

    <div style="margin-top: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
      <div style="padding: 12px; background: #fff; border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--text-muted);">PHONE CONTACT</div>
        <div style="font-size: 0.8125rem; font-weight: 700; color: #0f172a; margin-top: 2px;">${clinic.phone}</div>
      </div>
      <div style="padding: 12px; background: #fff; border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <div style="font-size: 0.6875rem; font-weight: 700; color: var(--text-muted);">OPERATING HOURS</div>
        <div style="font-size: 0.8125rem; font-weight: 700; color: #0f172a; margin-top: 2px;">${clinic.hours}</div>
      </div>
    </div>

    <div style="margin-top: 16px;">
      <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px;">SPECIALTIES AT THIS FACILITY</div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap;">
        ${clinic.specialties.map(s => `<span class="status-badge" style="background: #eff6ff; color: #2563eb;">${s}</span>`).join('')}
      </div>
    </div>

    <div style="margin-top: 24px; display: flex; justify-content: flex-end; gap: 10px;">
      <button class="bubble-btn bubble-btn-subtle" onclick="closeClinicProfileModal()">Close</button>
      <button class="bubble-btn bubble-btn-primary" onclick="closeClinicProfileModal(); openBookingWithClinic('${clinic.id}')">
        Book at this Center
      </button>
    </div>
  `;

  modal.classList.add('active');
  if (window.lucide) window.lucide.createIcons();
}

function closeClinicProfileModal() {
  const modal = document.getElementById('clinic-profile-modal');
  if (modal) modal.classList.remove('active');
}

// Guided 10-Step Booking
function openGuidedBookingModal() {
  bookingDraft.step = 1;
  updateBookingWizardUI();
  const modal = document.getElementById('booking-wizard-modal');
  if (modal) modal.classList.add('active');
}

function closeGuidedBookingModal() {
  const modal = document.getElementById('booking-wizard-modal');
  if (modal) modal.classList.remove('active');
}

function startBookingDoctor(docName, specialty, clinicName) {
  bookingDraft.doctor = docName;
  bookingDraft.service = specialty;
  bookingDraft.clinic = clinicName;
  bookingDraft.step = 4;
  updateBookingWizardUI();
  const modal = document.getElementById('booking-wizard-modal');
  if (modal) modal.classList.add('active');
}

function openBookingWithClinic(clinicId) {
  const clinic = CLINICS_DATA.find(c => c.id === clinicId);
  if (clinic) {
    bookingDraft.clinic = clinic.name;
    bookingDraft.step = 1;
    updateBookingWizardUI();
    const modal = document.getElementById('booking-wizard-modal');
    if (modal) modal.classList.add('active');
  }
}

function nextBookingStep() {
  if (bookingDraft.step < 10) {
    if (bookingDraft.step === 7) {
      const name = document.getElementById('wiz-patient-name')?.value;
      const email = document.getElementById('wiz-patient-email')?.value;
      const phone = document.getElementById('wiz-patient-phone')?.value;
      if (!name || !email || !phone) {
        alert('Please fill in your name, email, and phone number.');
        return;
      }
      bookingDraft.patientName = name;
      bookingDraft.email = email;
      bookingDraft.phone = phone;
    }
    if (bookingDraft.step === 8) {
      bookingDraft.reason = document.getElementById('wiz-patient-reason')?.value || '';
    }
    if (bookingDraft.step === 9) {
      confirmBooking();
      return;
    }

    bookingDraft.step++;
    updateBookingWizardUI();
  }
}

function prevBookingStep() {
  if (bookingDraft.step > 1) {
    bookingDraft.step--;
    updateBookingWizardUI();
  }
}

function setBookingDraft(field, val) {
  bookingDraft[field] = val;
  updateBookingWizardUI();
}

function updateBookingWizardUI() {
  const step = bookingDraft.step;

  document.querySelectorAll('.wizard-step-node').forEach(node => {
    const s = parseInt(node.getAttribute('data-step'), 10);
    node.classList.toggle('active', s === step);
    node.classList.toggle('completed', s < step);
  });

  const stepFill = document.getElementById('stepper-fill');
  if (stepFill) stepFill.style.width = `${((step - 1) / 9) * 100}%`;

  const panel = document.getElementById('wizard-step-content');
  if (!panel) return;

  switch (step) {
    case 1:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 1: Choose Specialty</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Select the clinical department for your consultation.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px;">
          ${SERVICES_DATA.map(s => `
            <div class="clinic-card ${bookingDraft.service === s.name ? 'selected' : ''}" onclick="setBookingDraft('service', '${s.name}')">
              <div style="font-weight: 700; font-size: 0.9375rem;">${s.title}</div>
              <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">${s.desc}</p>
              <div style="margin-top: 8px; font-size: 0.75rem; font-weight: 700; color: var(--accent-primary);">${s.fee} • ${s.time}</div>
            </div>
          `).join('')}
        </div>
      `;
      break;

    case 2:
      const eligibleDocs = DOCTORS_DATA.filter(d => d.specialty === bookingDraft.service);
      const docs = eligibleDocs.length > 0 ? eligibleDocs : DOCTORS_DATA;
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 2: Choose Specialist</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Accredited physicians in ${bookingDraft.service}.</p>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px;">
          ${docs.map(d => `
            <div class="clinic-card ${bookingDraft.doctor === d.name ? 'selected' : ''}" onclick="setBookingDraft('doctor', '${d.name}')">
              <div style="display: flex; gap: 12px; align-items: center;">
                <img src="${d.photo}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2563eb&color=fff'">
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
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 3: Choose Facility</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Select clinical center location.</p>
        <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
          ${CLINICS_DATA.map(c => `
            <div class="clinic-card ${bookingDraft.clinic === c.name ? 'selected' : ''}" onclick="setBookingDraft('clinic', '${c.name}')">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-weight: 700; font-size: 0.9375rem;">${c.name}</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">${c.address}</div>
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
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 4: Consultation Format</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Virtual telehealth or in-person clinic visit.</p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div class="clinic-card ${bookingDraft.type === 'Telehealth' ? 'selected' : ''}" onclick="setBookingDraft('type', 'Telehealth')" style="text-align: center; padding: 24px 16px;">
            <i data-lucide="video" style="width: 32px; height: 32px; color: #2563eb; margin-bottom: 8px;"></i>
            <div style="font-weight: 700;">Telehealth HD Video</div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Join securely from home.</p>
          </div>
          <div class="clinic-card ${bookingDraft.type === 'In-Person' ? 'selected' : ''}" onclick="setBookingDraft('type', 'In-Person')" style="text-align: center; padding: 24px 16px;">
            <i data-lucide="building" style="width: 32px; height: 32px; color: #2563eb; margin-bottom: 8px;"></i>
            <div style="font-weight: 700;">In-Person Clinic Visit</div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Meet at facility suite.</p>
          </div>
        </div>
      `;
      break;

    case 5:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 5: Pick Date</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Select consultation calendar day.</p>
        <div class="form-field" style="max-width: 320px;">
          <input type="date" class="form-input" value="${bookingDraft.date}" min="2026-10-03" onchange="setBookingDraft('date', this.value)">
        </div>
        <div style="display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap;">
          <button class="bubble-btn bubble-btn-subtle" onclick="setBookingDraft('date', '2026-10-08')">Oct 8 (Thu)</button>
          <button class="bubble-btn bubble-btn-subtle" onclick="setBookingDraft('date', '2026-10-09')">Oct 9 (Fri)</button>
          <button class="bubble-btn bubble-btn-subtle" onclick="setBookingDraft('date', '2026-10-12')">Oct 12 (Mon)</button>
        </div>
      `;
      break;

    case 6:
      const allSlots = ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '01:00 PM', '02:00 PM', '03:15 PM', '04:00 PM'];
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 6: Available Time Slots</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 12px;">Real-time availability for ${bookingDraft.doctor} on <strong>${bookingDraft.date}</strong>.</p>
        <div class="time-slots-grid">
          ${allSlots.map(slot => {
            const isAvail = window.HC_CORE.isSlotAvailable(bookingDraft.doctor, bookingDraft.date, slot);
            const isSelected = bookingDraft.time === slot;
            return `
              <div class="time-slot-pill ${isSelected ? 'selected' : ''} ${!isAvail ? 'disabled' : ''}"
                   onclick="${isAvail ? `setBookingDraft('time', '${slot}')` : ''}">
                ${slot}
                ${!isAvail ? '<div style="font-size: 0.625rem; color: #ef4444;">Booked</div>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
      break;

    case 7:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 7: Patient Details</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Contact records for appointment confirmation.</p>
        <div class="form-grid-2">
          <div class="form-field">
            <label class="form-label">Full Name *</label>
            <input type="text" id="wiz-patient-name" class="form-input" value="${bookingDraft.patientName || 'Mariane Millera'}" placeholder="e.g. Mariane Millera">
          </div>
          <div class="form-field">
            <label class="form-label">Email Address *</label>
            <input type="email" id="wiz-patient-email" class="form-input" value="${bookingDraft.email || 'patient@healthcare.com'}" placeholder="patient@gmail.com">
          </div>
          <div class="form-field">
            <label class="form-label">Phone Number *</label>
            <input type="tel" id="wiz-patient-phone" class="form-input" value="${bookingDraft.phone || '+1 (555) 019-2834'}" placeholder="+1 (555) 019-2834">
          </div>
        </div>
      `;
      break;

    case 8:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 8: Chief Complaint</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 14px;">Symptoms and consultation goals for physician review.</p>
        <div class="form-field">
          <textarea id="wiz-patient-reason" class="form-textarea" rows="4" placeholder="Detail symptoms, duration, current medications...">${bookingDraft.reason || 'Routine follow-up consultation.'}</textarea>
        </div>
      `;
      break;

    case 9:
      panel.innerHTML = `
        <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 6px;">Step 9: Review Summary</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 16px;">Please confirm details before reservation.</p>
        <div class="clinic-card" style="padding: 20px; background: #f8fafc;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <span class="metric-label">Physician</span>
              <div style="font-weight: 700;">${bookingDraft.doctor} (${bookingDraft.service})</div>
            </div>
            <div>
              <span class="metric-label">Schedule</span>
              <div style="font-weight: 700;">${bookingDraft.date} at ${bookingDraft.time}</div>
            </div>
            <div>
              <span class="metric-label">Facility</span>
              <div style="font-weight: 700;">${bookingDraft.clinic}</div>
            </div>
            <div>
              <span class="metric-label">Patient</span>
              <div style="font-weight: 700;">${bookingDraft.patientName}</div>
            </div>
          </div>
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
            Reference ID: ${bookingDraft.refCode}
          </div>
          <p style="font-size: 0.875rem; color: var(--text-secondary); max-width: 440px; margin: 0 auto 20px;">
            Your consultation with <strong>${bookingDraft.doctor}</strong> is scheduled for <strong>${bookingDraft.date} at ${bookingDraft.time}</strong> (${bookingDraft.type}).
          </p>
          <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button class="bubble-btn bubble-btn-primary" onclick="downloadBookingIcs()">
              <i data-lucide="calendar-plus" style="width: 14px; height: 14px;"></i> Add to Calendar (.ICS)
            </button>
            <a href="login.html" class="bubble-btn bubble-btn-subtle">
              Sign In to Patient Portal
            </a>
          </div>
        </div>
      `;
      break;
  }

  const prevBtn = document.getElementById('wiz-prev-btn');
  const nextBtn = document.getElementById('wiz-next-btn');
  if (prevBtn) prevBtn.style.display = (step === 1 || step === 10) ? 'none' : 'inline-flex';
  if (nextBtn) {
    if (step === 9) {
      nextBtn.textContent = 'Confirm Reservation';
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

function confirmBooking() {
  const res = window.HC_CORE.createAppointment({
    patientName: bookingDraft.patientName,
    email: bookingDraft.email,
    phone: bookingDraft.phone,
    doctor: bookingDraft.doctor,
    specialty: bookingDraft.service,
    clinic: bookingDraft.clinic,
    date: bookingDraft.date,
    time: bookingDraft.time,
    type: bookingDraft.type,
    reason: bookingDraft.reason
  });

  if (res.success) {
    bookingDraft.refCode = res.appointment.refCode;
    bookingDraft.step = 10;
    updateBookingWizardUI();
  } else {
    alert(res.error);
  }
}

function downloadBookingIcs() {
  const dateClean = bookingDraft.date.replace(/-/g, '');
  const startTime = dateClean + 'T143000Z';
  const endTime = dateClean + 'T151500Z';

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Healthcare System//Appointment//EN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Consultation with ${bookingDraft.doctor}
DESCRIPTION:${bookingDraft.service} consultation. Reference: ${bookingDraft.refCode}
LOCATION:${bookingDraft.clinic}
DTSTART:${startTime}
DTEND:${endTime}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Appointment-${bookingDraft.date}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', () => {
  initPublicMap();
  renderFeaturedDoctors();
  renderPublicClinics();

  const searchInp = document.getElementById('doctor-search-input');
  if (searchInp) {
    searchInp.addEventListener('input', (e) => {
      doctorSearchQuery = e.target.value.toLowerCase().trim();
      renderFeaturedDoctors();
    });
  }
});
