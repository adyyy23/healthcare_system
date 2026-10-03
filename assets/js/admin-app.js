/**
 * Hospital Operations Admin Console Script
 */

let activeAdminTab = 'overview';

// Require Admin Authentication
window.HC_CORE.requireAuth('admin');

function switchAdminTab(tabKey) {
  activeAdminTab = tabKey;
  document.querySelectorAll('[data-atab]').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-atab') === tabKey);
  });
  document.querySelectorAll('.admin-view-panel').forEach(view => {
    view.classList.toggle('active', view.id === `admin-view-${tabKey}`);
  });

  renderAdminPanels();
}

function renderAdminPanels() {
  renderAdminOverview();
  renderAdminAppointments();
  renderAdminDoctors();
  renderAdminClinics();
  renderAdminAudit();
  if (window.lucide) window.lucide.createIcons();
}

function renderAdminOverview() {
  const tbody = document.getElementById('admin-overview-tbody');
  if (!tbody) return;

  const appts = window.HC_CORE.appointments.slice(0, 5);
  tbody.innerHTML = appts.map(a => `
    <tr>
      <td><strong>${a.refCode}</strong></td>
      <td>${a.patientName}</td>
      <td>${a.doctor}</td>
      <td>${a.specialty}</td>
      <td>${a.date} • ${a.time}</td>
      <td><span class="status-badge ${a.status}">${a.status}</span></td>
    </tr>
  `).join('');
}

function renderAdminAppointments() {
  const tbody = document.getElementById('admin-full-appts-tbody');
  if (!tbody) return;

  const search = document.getElementById('admin-appt-search')?.value.toLowerCase().trim() || '';
  const filter = document.getElementById('admin-appt-status-filter')?.value || 'all';

  const appts = window.HC_CORE.appointments.filter(a => {
    const matchFilter = (filter === 'all') || (a.status === filter);
    const matchSearch = !search ||
      a.patientName.toLowerCase().includes(search) ||
      a.doctor.toLowerCase().includes(search) ||
      a.refCode.toLowerCase().includes(search);
    return matchFilter && matchSearch;
  });

  tbody.innerHTML = appts.map(a => `
    <tr>
      <td><strong>${a.refCode}</strong></td>
      <td>
        <strong>${a.patientName}</strong>
        <div style="font-size: 0.6875rem; color: var(--text-muted);">${a.email}</div>
      </td>
      <td>${a.doctor}</td>
      <td>${a.specialty}</td>
      <td>${a.date} • ${a.time}</td>
      <td><span class="status-badge ${a.status}">${a.status}</span></td>
      <td style="text-align: right;">
        <select onchange="handleAdminStatusChange(${a.id}, this.value)" style="padding: 4px 8px; border-radius: 8px; border: 1px solid var(--border-subtle); font-size: 0.75rem;">
          <option value="pending" ${a.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="approved" ${a.status === 'approved' ? 'selected' : ''}>Approved</option>
          <option value="completed" ${a.status === 'completed' ? 'selected' : ''}>Completed</option>
          <option value="cancelled" ${a.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function handleAdminStatusChange(apptId, newStatus) {
  window.HC_CORE.updateAppointmentStatus(apptId, newStatus, 'Dr. Evelyn Reed (Admin)');
  renderAdminPanels();
}

function renderAdminDoctors() {
  const tbody = document.getElementById('admin-doctors-tbody');
  if (!tbody) return;

  tbody.innerHTML = DOCTORS_DATA.map(d => `
    <tr>
      <td>
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${d.photo}" style="width: 36px; height: 36px; border-radius: 50%; object-fit: cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(d.name)}&background=2563eb&color=fff'">
          <div>
            <strong>${d.name}</strong>
            <div style="font-size: 0.6875rem; color: var(--text-muted);">${d.experience}</div>
          </div>
        </div>
      </td>
      <td>${d.specialty}</td>
      <td><code>${d.license}</code></td>
      <td>${d.clinicName}</td>
      <td><span class="status-badge confirmed">Accredited</span></td>
      <td style="text-align: right;">
        <button class="bubble-btn bubble-btn-subtle" style="padding: 4px 10px; font-size: 0.75rem;" onclick="alert('Viewing provider audit profile for ' + '${d.name}')">
          Audit
        </button>
      </td>
    </tr>
  `).join('');
}

function renderAdminClinics() {
  const tbody = document.getElementById('admin-clinics-tbody');
  if (!tbody) return;

  tbody.innerHTML = CLINICS_DATA.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.address}</td>
      <td>${c.phone}</td>
      <td>${c.hours}</td>
      <td><span class="status-badge confirmed">Operational</span></td>
    </tr>
  `).join('');
}

function renderAdminAudit() {
  const tbody = document.getElementById('admin-audit-tbody');
  if (!tbody) return;

  const logs = window.HC_CORE.auditLogs;
  tbody.innerHTML = logs.map(l => `
    <tr>
      <td><code>${l.timestamp}</code></td>
      <td><strong>${l.action}</strong></td>
      <td style="max-width: 320px; font-size: 0.8125rem;">${l.target}</td>
      <td><span style="font-size: 0.75rem; color: var(--accent-primary);">${l.user}</span></td>
    </tr>
  `).join('');
}

// Add Doctor Modal
function openAddDoctorModal() {
  const modal = document.getElementById('admin-add-doctor-modal');
  if (modal) modal.classList.add('active');
}
function closeAddDoctorModal() {
  const modal = document.getElementById('admin-add-doctor-modal');
  if (modal) modal.classList.remove('active');
}

function handleAddDoctor(e) {
  e.preventDefault();
  const name = document.getElementById('new-doc-name').value;
  const spec = document.getElementById('new-doc-spec').value;
  const lic = document.getElementById('new-doc-lic').value;
  const clinic = document.getElementById('new-doc-clinic').value;

  DOCTORS_DATA.unshift({
    id: `doc-${Date.now()}`,
    name: name,
    specialty: spec,
    subSpecialty: `${spec} Specialist`,
    photo: 'images/doctor 1.jpg',
    rating: 5.0,
    reviewsCount: 1,
    experience: 'New Accredited Physician',
    license: lic,
    clinicName: clinic,
    telehealth: true,
    inPerson: true,
    hours: 'Mon - Fri (09:00 AM - 05:00 PM)',
    languages: ['English'],
    bio: 'Accredited specialist.',
    education: 'Board-Certified'
  });

  window.HC_CORE.addAuditLog('Physician Accredited', `${name} (${lic}) added to staff`, 'Dr. Evelyn Reed (Admin)');
  closeAddDoctorModal();
  renderAdminPanels();
  alert(`${name} has been accredited and added to hospital staff.`);
}

document.addEventListener('DOMContentLoaded', () => {
  renderAdminPanels();

  const searchInp = document.getElementById('admin-appt-search');
  if (searchInp) {
    searchInp.addEventListener('input', () => renderAdminAppointments());
  }
});
