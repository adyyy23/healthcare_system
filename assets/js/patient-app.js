/**
 * Patient Mobile App Interaction Script
 */

let activePatientTab = 'home';
let activeApptFilter = 'upcoming';
let activeConversationId = 'conv-1';
let patientRescheduleId = null;
let patientReviewApptId = null;
let homeMapInstance = null;
let exploreMapInstance = null;

// Require patient authentication
window.HC_CORE.requireAuth('patient');

function switchPatientTab(tabKey) {
  activePatientTab = tabKey;
  document.querySelectorAll('.dock-item').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-ptab') === tabKey);
  });
  document.querySelectorAll('.patient-tab-view').forEach(view => {
    view.classList.toggle('active', view.id === `patient-tab-${tabKey}`);
  });

  if (tabKey === 'explore' && document.getElementById('explore-map-container').style.display !== 'none') {
    setTimeout(() => { if (exploreMapInstance) exploreMapInstance.invalidateSize(); }, 150);
  }
  if (tabKey === 'home') {
    setTimeout(() => { if (homeMapInstance) homeMapInstance.invalidateSize(); }, 150);
  }

  renderPatientViews();
}

function renderPatientViews() {
  renderPatientSpotlight();
  renderPatientHomeAppts();
  renderPatientFullAppts();
  renderPatientExploreList();
  renderConversationsList();
  renderSavedDoctors();
  renderNotifications();
  if (window.lucide) window.lucide.createIcons();
}

// 1. Next Appointment Spotlight
function renderPatientSpotlight() {
  const container = document.getElementById('patient-spotlight-appt');
  if (!container) return;

  const nextAppt = window.HC_CORE.appointments.find(a => (a.status === 'approved' || a.status === 'pending') && a.patientName === 'Mariane Millera');
  if (nextAppt) {
    const parts = nextAppt.date.split('-');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const mo = monthNames[parseInt(parts[1], 10) - 1] || 'Oct';
    const day = parts[2] || '08';

    container.innerHTML = `
      <div class="next-appointment-card">
        <div class="next-card-content">
          <div class="next-date-badge">
            <span class="next-date-month">${mo}</span>
            <span class="next-date-day">${day}</span>
          </div>
          <div class="next-info-wrap">
            <div class="next-label-pill">Next Consultation</div>
            <div class="next-doctor-title">${nextAppt.doctor}</div>
            <div class="next-meta-row" style="font-size: 0.75rem;">
              <span>${nextAppt.specialty}</span>
              <span>•</span>
              <span>${nextAppt.time}</span>
              <span>•</span>
              <span style="font-weight: 700; color: #2563eb;">${nextAppt.type}</span>
            </div>
          </div>
          <div style="display: flex; gap: 8px; width: 100%; margin-top: 10px;">
            ${nextAppt.type === 'Telehealth' ? `
              <button class="bubble-btn bubble-btn-primary" style="flex: 1; padding: 8px; font-size: 0.75rem; justify-content: center;" onclick="alert('Telehealth video consultation link will activate 15 minutes prior to appointment.')">
                <i data-lucide="video" style="width: 14px; height: 14px;"></i> Telehealth
              </button>
            ` : `
              <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextAppt.clinic)}" target="_blank" class="bubble-btn bubble-btn-primary" style="flex: 1; padding: 8px; font-size: 0.75rem; justify-content: center;">
                <i data-lucide="navigation" style="width: 14px; height: 14px;"></i> Directions
              </a>
            `}
            <button class="bubble-btn bubble-btn-subtle" style="padding: 8px 12px; font-size: 0.75rem;" onclick="openRescheduleModal(${nextAppt.id})">
              Reschedule
            </button>
          </div>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="next-appointment-card" style="text-align: center; padding: 24px 16px;">
        <i data-lucide="calendar-check" style="width: 32px; height: 32px; color: #2563eb; margin-bottom: 8px;"></i>
        <div style="font-weight: 700; font-size: 0.9375rem;">No Consultations Scheduled</div>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Book an appointment with accredited specialists.</p>
        <button class="bubble-btn bubble-btn-primary" style="margin-top: 12px; padding: 6px 14px; font-size: 0.75rem;" onclick="switchPatientTab('explore')">
          Explore Doctors
        </button>
      </div>
    `;
  }
}

// 2. Mini Home Appointments
function renderPatientHomeAppts() {
  const container = document.getElementById('patient-home-appts-list');
  if (!container) return;

  const appts = window.HC_CORE.appointments.filter(a => a.patientName === 'Mariane Millera' && (a.status === 'approved' || a.status === 'pending')).slice(0, 2);
  if (appts.length === 0) {
    container.innerHTML = `<div style="font-size: 0.75rem; color: var(--text-muted);">No further upcoming appointments.</div>`;
    return;
  }

  container.innerHTML = appts.map(a => `
    <div class="appointment-item-card" style="padding: 12px; margin-bottom: 8px;">
      <div class="appointment-left-col">
        <div class="appointment-date-pill" style="width: 48px; height: 48px;">
          <span class="app-date-mo">${a.date.split('-')[1]}</span>
          <span class="app-date-num">${a.date.split('-')[2]}</span>
        </div>
        <div>
          <div style="font-weight: 700; font-size: 0.875rem;">${a.doctor}</div>
          <div style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 600;">${a.specialty} • ${a.time}</div>
        </div>
      </div>
      <span class="status-badge ${a.status}">${a.status}</span>
    </div>
  `).join('');
}

// 3. Appointments Tab Filter & History Trail
function filterPatientAppts(filterKey) {
  activeApptFilter = filterKey;
  document.querySelectorAll('[data-pfilter]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-pfilter') === filterKey);
  });
  renderPatientFullAppts();
}

function renderPatientFullAppts() {
  const container = document.getElementById('patient-full-appts-list');
  if (!container) return;

  const appts = window.HC_CORE.appointments.filter(a => {
    if (activeApptFilter === 'upcoming') return a.status === 'approved' || a.status === 'pending';
    if (activeApptFilter === 'completed') return a.status === 'completed';
    if (activeApptFilter === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  if (appts.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 32px 16px; background: #fff; border-radius: 18px; border: 1px dashed var(--border-strong);">
        <i data-lucide="calendar-x" style="width: 32px; height: 32px; color: var(--text-muted); margin-bottom: 6px;"></i>
        <div style="font-weight: 700; font-size: 0.875rem;">No ${activeApptFilter} appointments</div>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = appts.map(a => {
    const historyList = a.history || [];
    return `
      <div class="appointment-item-card" style="flex-direction: column; align-items: stretch; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="font-weight: 800; font-size: 0.9375rem; color: #0f172a;">${a.doctor}</div>
            <div style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 700;">${a.specialty} • ${a.type}</div>
            <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 2px;">
              ${a.date} at ${a.time} • Ref: <strong>${a.refCode}</strong>
            </div>
          </div>
          <span class="status-badge ${a.status}">${a.status}</span>
        </div>

        <!-- Status History Trail -->
        <div style="background: #f8fafc; border-radius: 12px; padding: 8px 12px; border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.625rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Status Timeline</div>
          <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
            ${historyList.map(h => `
              <div style="font-size: 0.6875rem; color: var(--text-secondary); display: flex; justify-content: space-between;">
                <span>• <strong>${h.status}</strong> by ${h.by}</span>
                <span style="color: var(--text-muted);">${h.time}</span>
              </div>
            `).join('')}
          </div>
        </div>

        ${a.notes ? `
          <div style="font-size: 0.75rem; color: #334155; padding: 6px 10px; background: #eff6ff; border-radius: 8px;">
            <strong>Physician Note:</strong> ${a.notes}
          </div>
        ` : ''}

        <!-- Actions -->
        <div style="display: flex; gap: 8px; justify-content: flex-end; flex-wrap: wrap;">
          <button class="bubble-btn bubble-btn-subtle" style="padding: 5px 10px; font-size: 0.6875rem;" onclick="downloadPatientIcs(${a.id})">
            <i data-lucide="calendar-plus" style="width: 12px; height: 12px;"></i> .ICS
          </button>
          ${a.status === 'completed' && !a.review ? `
            <button class="bubble-btn bubble-btn-primary" style="padding: 5px 10px; font-size: 0.6875rem;" onclick="openReviewModal(${a.id})">
              Rate Doctor
            </button>
          ` : ''}
          ${a.status !== 'completed' && a.status !== 'cancelled' ? `
            <button class="bubble-btn bubble-btn-subtle" style="padding: 5px 10px; font-size: 0.6875rem;" onclick="openRescheduleModal(${a.id})">
              Reschedule
            </button>
            <button class="bubble-btn bubble-btn-subtle" style="padding: 5px 10px; font-size: 0.6875rem; color: #ef4444;" onclick="cancelPatientAppt(${a.id})">
              Cancel
            </button>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function cancelPatientAppt(id) {
  if (confirm('Cancel this consultation?')) {
    window.HC_CORE.updateAppointmentStatus(id, 'cancelled', 'Mariane Millera');
    renderPatientViews();
  }
}

function openRescheduleModal(id) {
  patientRescheduleId = id;
  const modal = document.getElementById('patient-reschedule-modal');
  if (modal) modal.classList.add('active');
}

function closeRescheduleModal() {
  const modal = document.getElementById('patient-reschedule-modal');
  if (modal) modal.classList.remove('active');
  patientRescheduleId = null;
}

function confirmPatientReschedule() {
  const newDate = document.getElementById('p-resched-date')?.value;
  const newTime = document.getElementById('p-resched-time')?.value;
  if (newDate && newTime && patientRescheduleId) {
    const res = window.HC_CORE.rescheduleAppointment(patientRescheduleId, newDate, newTime, 'Mariane Millera');
    if (res.success) {
      closeRescheduleModal();
      renderPatientViews();
      alert(`Consultation successfully rescheduled to ${newDate} at ${newTime}.`);
    } else {
      alert(res.error);
    }
  }
}

function openReviewModal(id) {
  patientReviewApptId = id;
  const modal = document.getElementById('patient-review-modal');
  if (modal) modal.classList.add('active');
}

function closeReviewModal() {
  const modal = document.getElementById('patient-review-modal');
  if (modal) modal.classList.remove('active');
  patientReviewApptId = null;
}

function submitPatientReview() {
  const rating = parseInt(document.getElementById('review-stars-select')?.value, 10);
  const comment = document.getElementById('review-comment-text')?.value;
  if (patientReviewApptId) {
    window.HC_CORE.submitAppointmentReview(patientReviewApptId, rating, comment);
    closeReviewModal();
    renderPatientViews();
    alert('Thank you! Your feedback has been recorded.');
  }
}

function downloadPatientIcs(id) {
  const appt = window.HC_CORE.appointments.find(a => a.id === id);
  if (!appt) return;

  const dateClean = appt.date.replace(/-/g, '');
  const startTime = dateClean + 'T143000Z';
  const endTime = dateClean + 'T151500Z';

  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Healthcare System//Patient App//EN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Medical Visit with ${appt.doctor}
DESCRIPTION:${appt.specialty} consultation. Reference: ${appt.refCode}
LOCATION:${appt.clinic}
DTSTART:${startTime}
DTEND:${endTime}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Appointment-${appt.date}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// 4. Explore (Map vs List)
function setExploreMode(mode) {
  const listBtn = document.getElementById('explore-view-list-btn');
  const mapBtn = document.getElementById('explore-view-map-btn');
  const mapContainer = document.getElementById('explore-map-container');

  if (mode === 'map') {
    listBtn.classList.remove('active');
    mapBtn.classList.add('active');
    mapContainer.style.display = 'block';
    initExploreMap();
  } else {
    listBtn.classList.add('active');
    mapBtn.classList.remove('active');
    mapContainer.style.display = 'none';
  }
}

function initExploreMap() {
  if (typeof L === 'undefined') return;
  if (!exploreMapInstance) {
    exploreMapInstance = L.map('patient-explore-map', {
      center: [40.7589, -73.9780],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(exploreMapInstance);

    CLINICS_DATA.forEach(clinic => {
      const marker = L.circleMarker([clinic.lat, clinic.lng], {
        radius: 8,
        fillColor: '#2563eb',
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9
      }).addTo(exploreMapInstance);
      marker.bindPopup(`<strong>${clinic.name}</strong><br>${clinic.distance} away`);
    });
  }
  setTimeout(() => { if (exploreMapInstance) exploreMapInstance.invalidateSize(); }, 150);
}

function renderPatientExploreList() {
  const container = document.getElementById('patient-explore-list');
  if (!container) return;

  const query = document.getElementById('patient-explore-search')?.value.toLowerCase().trim() || '';
  const docs = DOCTORS_DATA.filter(d => 
    !query || d.name.toLowerCase().includes(query) || d.specialty.toLowerCase().includes(query) || d.clinicName.toLowerCase().includes(query)
  );

  container.innerHTML = docs.map(d => {
    const isSaved = window.HC_CORE.isDoctorSaved(d.id);
    return `
      <div class="clinic-card" style="padding: 14px;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${d.photo}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2563eb&color=fff'">
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div style="font-weight: 700; font-size: 0.875rem;">${d.name}</div>
                <div style="font-size: 0.6875rem; color: var(--accent-primary); font-weight: 600;">${d.subSpecialty}</div>
              </div>
              <button onclick="toggleSave('${d.id}')" style="color: ${isSaved ? '#ef4444' : '#94a3b8'};">
                <i data-lucide="heart" style="width: 16px; height: 16px; fill: ${isSaved ? '#ef4444' : 'none'};"></i>
              </button>
            </div>
            <div style="font-size: 0.6875rem; color: var(--text-muted); margin-top: 2px;">
              ${d.clinicName} • ★ ${d.rating}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

function toggleSave(docId) {
  window.HC_CORE.toggleSaveDoctor(docId);
  renderPatientViews();
}

function renderSavedDoctors() {
  const container = document.getElementById('patient-saved-doctors-list');
  if (!container) return;

  const savedIds = window.HC_CORE.savedDoctors;
  const docs = DOCTORS_DATA.filter(d => savedIds.includes(d.id));

  if (docs.length === 0) {
    container.innerHTML = `<div style="font-size: 0.75rem; color: var(--text-muted);">No saved specialists yet.</div>`;
    return;
  }

  container.innerHTML = docs.map(d => `
    <div class="clinic-card" style="padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; gap: 10px; align-items: center;">
        <img src="${d.photo}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2563eb&color=fff'">
        <div>
          <div style="font-weight: 700; font-size: 0.8125rem;">${d.name}</div>
          <div style="font-size: 0.6875rem; color: var(--text-muted);">${d.specialty}</div>
        </div>
      </div>
      <button class="bubble-btn bubble-btn-primary" style="padding: 4px 10px; font-size: 0.6875rem;" onclick="switchPatientTab('explore')">Book</button>
    </div>
  `).join('');
}

// 5. In-App Messaging
function renderConversationsList() {
  const list = document.getElementById('patient-convos-list');
  if (!list) return;

  const convos = window.HC_CORE.conversations;
  list.innerHTML = convos.map(c => `
    <div class="clinic-card" style="padding: 12px; cursor: pointer;" onclick="openChatThread('${c.id}')">
      <div style="display: flex; gap: 12px; align-items: center;">
        <div class="avatar-circle" style="width: 42px; height: 42px; font-weight: 700;">${c.doctorName.split(' ')[1]?.[0] || 'DR'}</div>
        <div style="flex: 1;">
          <div style="display: flex; justify-content: space-between;">
            <strong style="font-size: 0.875rem; color: #0f172a;">${c.doctorName}</strong>
            <span style="font-size: 0.6875rem; color: var(--text-muted);">${c.lastTime}</span>
          </div>
          <div style="font-size: 0.75rem; color: var(--accent-primary); font-weight: 600;">${c.specialty}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; max-width: 240px;">
            ${c.lastMessage}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function openChatThread(convId) {
  activeConversationId = convId;
  const conv = window.HC_CORE.conversations.find(c => c.id === convId);
  if (!conv) return;

  document.getElementById('patient-convos-list').style.display = 'none';
  const threadView = document.getElementById('patient-chat-thread-view');
  threadView.style.display = 'block';

  document.getElementById('active-chat-title').textContent = conv.doctorName;
  renderChatThreadMessages();
}

function closeChatThread() {
  document.getElementById('patient-convos-list').style.display = 'flex';
  document.getElementById('patient-chat-thread-view').style.display = 'none';
}

function renderChatThreadMessages() {
  const conv = window.HC_CORE.conversations.find(c => c.id === activeConversationId);
  const container = document.getElementById('chat-thread-messages');
  if (!container || !conv) return;

  container.innerHTML = conv.messages.map(m => {
    const isMe = m.sender === 'patient';
    return `
      <div style="display: flex; justify-content: ${isMe ? 'flex-end' : 'flex-start'}; margin-bottom: 8px;">
        <div style="background: ${isMe ? '#2563eb' : '#f1f5f9'}; color: ${isMe ? '#fff' : '#0f172a'}; padding: 8px 12px; border-radius: 16px; max-width: 80%; font-size: 0.8125rem;">
          <div>${m.text}</div>
          <div style="font-size: 0.625rem; opacity: 0.7; text-align: right; margin-top: 2px;">${m.time}</div>
        </div>
      </div>
    `;
  }).join('');
  container.scrollTop = container.scrollHeight;
}

function sendPatientMessage() {
  const inp = document.getElementById('patient-msg-input');
  if (!inp || !inp.value.trim()) return;

  const text = inp.value.trim();
  inp.value = '';
  window.HC_CORE.sendMessage(activeConversationId, text, 'patient');
  renderChatThreadMessages();

  // Simulated doctor reply after 1.2s
  setTimeout(() => {
    window.HC_CORE.sendMessage(activeConversationId, "Received your message, Mariane. I'll make note of this on your clinical file.", 'doctor');
    renderChatThreadMessages();
  }, 1200);
}

// 6. Notifications
function openPatientNotifications() {
  const modal = document.getElementById('patient-notif-modal');
  if (modal) modal.classList.add('active');
}
function closePatientNotifications() {
  const modal = document.getElementById('patient-notif-modal');
  if (modal) modal.classList.remove('active');
}

function renderNotifications() {
  const container = document.getElementById('patient-notif-list');
  const dot = document.getElementById('patient-notif-dot');
  if (!container) return;

  const notifs = window.HC_CORE.notifications.filter(n => n.role === 'patient');
  const unread = notifs.filter(n => !n.read).length;
  if (dot) dot.style.display = unread > 0 ? 'block' : 'none';

  container.innerHTML = notifs.map(n => `
    <div style="padding: 10px; background: #f8fafc; border-radius: 12px; border: 1px solid var(--border-subtle);">
      <div style="font-weight: 700; font-size: 0.8125rem;">${n.title}</div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${n.message}</div>
      <div style="font-size: 0.625rem; color: var(--text-muted); margin-top: 4px;">${n.time}</div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderPatientViews();

  // Mini home map
  if (typeof L !== 'undefined') {
    homeMapInstance = L.map('patient-home-map', {
      center: [40.7589, -73.9780],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(homeMapInstance);
  }

  const searchInp = document.getElementById('patient-explore-search');
  if (searchInp) {
    searchInp.addEventListener('input', () => renderPatientExploreList());
  }
});
