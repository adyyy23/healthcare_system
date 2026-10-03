/**
 * Doctor Clinical Workspace Interaction Script
 */

let activeDoctorTab = 'schedule';
let activeDoctorConvoId = 'conv-1';
let activeNotesId = null;

// Require doctor authentication
window.HC_CORE.requireAuth('doctor');

function switchDoctorTab(tabKey) {
  activeDoctorTab = tabKey;
  document.querySelectorAll('[data-dtab]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-dtab') === tabKey);
  });
  document.querySelectorAll('.doctor-subview').forEach(view => {
    view.classList.toggle('active', view.id === `doctor-subview-${tabKey}`);
  });

  renderDoctorWorkspace();
}

function renderDoctorWorkspace() {
  renderDoctorTimeline();
  renderDoctorQueue();
  renderDoctorPatients();
  renderDoctorConvos();
  if (window.lucide) window.lucide.createIcons();
}

// 1. Today's Timeline
function renderDoctorTimeline() {
  const container = document.getElementById('doctor-timeline-container');
  if (!container) return;

  const appts = window.HC_CORE.appointments.filter(a => a.doctor.includes('Sarah Ramos'));
  container.innerHTML = appts.map(a => `
    <div class="timeline-node">
      <div style="min-width: 90px; font-weight: 800; font-size: 0.9375rem; color: var(--accent-primary);">
        ${a.time}
      </div>
      <div style="flex: 1;">
        <div style="font-weight: 800; font-size: 0.9375rem; color: #0f172a;">${a.patientName}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${a.specialty} • ${a.type} • Ref: ${a.refCode}</div>
      </div>
      <span class="status-badge ${a.status}">${a.status}</span>
    </div>
  `).join('');
}

// 2. Doctor Queue
function renderDoctorQueue() {
  const tbody = document.getElementById('doctor-queue-tbody');
  if (!tbody) return;

  const appts = window.HC_CORE.appointments.filter(a => a.doctor.includes('Sarah Ramos'));
  tbody.innerHTML = appts.map(a => `
    <tr>
      <td>
        <strong>${a.patientName}</strong>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${a.phone}</div>
      </td>
      <td>
        <strong>${a.date}</strong>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${a.time}</div>
      </td>
      <td>
        <span class="status-badge" style="background: #eff6ff; color: #2563eb;">${a.type}</span>
      </td>
      <td style="max-width: 240px; font-size: 0.8125rem;">
        ${a.reason || 'Routine follow-up'}
      </td>
      <td>
        <span class="status-badge ${a.status}">${a.status}</span>
      </td>
      <td style="text-align: right;">
        <div style="display: inline-flex; gap: 4px;">
          ${a.status === 'pending' ? `
            <button class="bubble-btn bubble-btn-primary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="approveAppt(${a.id})">Approve</button>
          ` : ''}
          <button class="bubble-btn bubble-btn-subtle" style="padding: 4px 8px; font-size: 0.75rem;" onclick="openClinicalNotesModal(${a.id})">Notes</button>
          ${a.status !== 'completed' && a.status !== 'cancelled' ? `
            <button class="bubble-btn bubble-btn-primary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="markApptComplete(${a.id})">Complete</button>
          ` : ''}
        </div>
      </td>
    </tr>
  `).join('');
}

function approveAppt(id) {
  window.HC_CORE.updateAppointmentStatus(id, 'approved', 'Dr. Sarah Ramos, MD');
  renderDoctorWorkspace();
}

function markApptComplete(id) {
  window.HC_CORE.updateAppointmentStatus(id, 'completed', 'Dr. Sarah Ramos, MD');
  renderDoctorWorkspace();
}

function openClinicalNotesModal(id) {
  activeNotesId = id;
  const appt = window.HC_CORE.appointments.find(a => a.id === id);
  const textarea = document.getElementById('clinical-notes-textarea');
  if (textarea && appt) textarea.value = appt.notes || '';
  const modal = document.getElementById('doctor-clinical-notes-modal');
  if (modal) modal.classList.add('active');
}

function closeClinicalNotesModal() {
  const modal = document.getElementById('doctor-clinical-notes-modal');
  if (modal) modal.classList.remove('active');
  activeNotesId = null;
}

function saveDoctorClinicalNotes() {
  const text = document.getElementById('clinical-notes-textarea')?.value;
  if (activeNotesId) {
    window.HC_CORE.updateAppointmentStatus(activeNotesId, 'approved', 'Dr. Sarah Ramos, MD', text);
    closeClinicalNotesModal();
    renderDoctorWorkspace();
    alert('Clinical consultation notes saved to patient record.');
  }
}

// 3. Patients Directory
function renderDoctorPatients() {
  const container = document.getElementById('doctor-patients-grid');
  if (!container) return;

  const patients = [
    { name: 'Mariane Millera', id: 'PT-1042', blood: 'O+', phone: '+1 (555) 019-2834', lastVisit: 'Sep 22, 2026', condition: 'Arrhythmia Management' },
    { name: 'Robert Sterling', id: 'PT-1055', blood: 'A+', phone: '+1 (555) 019-8765', lastVisit: 'Aug 14, 2026', condition: 'Hypertension Review' },
    { name: 'Clara Oswald', id: 'PT-1082', blood: 'B+', phone: '+1 (555) 019-4321', lastVisit: 'Jul 30, 2026', condition: 'Lipid Panel Follow-up' }
  ];

  container.innerHTML = patients.map(p => `
    <div class="clinic-card" style="padding: 18px;">
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 12px;">
        <div class="avatar-circle" style="width: 44px; height: 44px; font-weight: 800;">${p.name.split(' ').map(n=>n[0]).join('')}</div>
        <div>
          <div style="font-weight: 800; font-size: 1rem; color: #0f172a;">${p.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Record ID: #${p.id} • Blood: ${p.blood}</div>
        </div>
      </div>
      <div style="font-size: 0.8125rem; color: var(--text-secondary); margin-bottom: 6px;">
        <strong>Clinical Condition:</strong> ${p.condition}
      </div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 14px;">
        Last Consultation: ${p.lastVisit}
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="bubble-btn bubble-btn-primary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="switchDoctorTab('messages')">
          Message Patient
        </button>
        <button class="bubble-btn bubble-btn-subtle" style="padding: 6px 12px; font-size: 0.75rem;" onclick="alert('Viewing comprehensive history for #' + '${p.id}')">
          View History
        </button>
      </div>
    </div>
  `).join('');
}

// 4. In-App Messaging
function renderDoctorConvos() {
  const sidebar = document.getElementById('doctor-convo-sidebar');
  if (!sidebar) return;

  const convos = window.HC_CORE.conversations;
  sidebar.innerHTML = convos.map(c => `
    <div style="padding: 10px; border-radius: 12px; background: ${c.id === activeDoctorConvoId ? '#e2eaf4' : '#fff'}; border: 1px solid var(--border-subtle); margin-bottom: 8px; cursor: pointer;" onclick="selectDoctorConvo('${c.id}')">
      <div style="font-weight: 700; font-size: 0.8125rem;">${c.patientName}</div>
      <div style="font-size: 0.6875rem; color: var(--text-muted); text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">${c.lastMessage}</div>
    </div>
  `).join('');

  renderDoctorChatMessages();
}

function selectDoctorConvo(id) {
  activeDoctorConvoId = id;
  renderDoctorConvos();
}

function renderDoctorChatMessages() {
  const box = document.getElementById('doc-chat-messages-box');
  const conv = window.HC_CORE.conversations.find(c => c.id === activeDoctorConvoId);
  if (!box || !conv) return;

  box.innerHTML = conv.messages.map(m => {
    const isDoctor = m.sender === 'doctor';
    return `
      <div style="display: flex; justify-content: ${isDoctor ? 'flex-end' : 'flex-start'}; margin-bottom: 10px;">
        <div style="background: ${isDoctor ? '#2563eb' : '#f1f5f9'}; color: ${isDoctor ? '#fff' : '#0f172a'}; padding: 8px 14px; border-radius: 16px; max-width: 75%; font-size: 0.8125rem;">
          <div>${m.text}</div>
          <div style="font-size: 0.625rem; opacity: 0.7; text-align: right; margin-top: 2px;">${m.time}</div>
        </div>
      </div>
    `;
  }).join('');
  box.scrollTop = box.scrollHeight;
}

function sendDoctorMessage() {
  const inp = document.getElementById('doc-msg-input');
  if (!inp || !inp.value.trim()) return;

  const text = inp.value.trim();
  inp.value = '';
  window.HC_CORE.sendMessage(activeDoctorConvoId, text, 'doctor');
  renderDoctorChatMessages();
}

document.addEventListener('DOMContentLoaded', () => {
  renderDoctorWorkspace();
});
