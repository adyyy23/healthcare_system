/**
 * HealthCare System 2026 — Core Data Store & Role Session Architecture
 * Centralized data, role permissions, messaging, appointments history, conflict prevention.
 */

// ============================================================================
// 1. DEMO ACCOUNTS & ROLES
// ============================================================================
const DEMO_ACCOUNTS = [
  {
    id: 'user-patient-1',
    email: 'patient@healthcare.com',
    password: 'patient123',
    role: 'patient',
    name: 'Mariane Millera',
    phone: '+1 (555) 019-2834',
    bloodType: 'O+',
    patientId: 'PT-1042',
    avatar: 'MM',
    insurance: 'Blue Cross Blue Shield (PPO)',
    emergencyContact: 'Mark Millera (+1 555-0199)'
  },
  {
    id: 'user-doctor-1',
    email: 'doctor@healthcare.com',
    password: 'doctor123',
    role: 'doctor',
    doctorId: 'doc-1',
    name: 'Dr. Sarah Ramos, MD',
    specialty: 'Cardiology',
    license: 'MED-84920',
    clinicId: 'clinic-1',
    clinicName: 'St. Jude Medical Center — Downtown Main Campus',
    avatar: 'SR',
    hours: 'Mon - Fri (09:00 AM - 04:00 PM)'
  },
  {
    id: 'user-doctor-2',
    email: 'santos@healthcare.com',
    password: 'doctor123',
    role: 'doctor',
    doctorId: 'doc-2',
    name: 'Dr. Julian Santos, MD',
    specialty: 'General Medicine',
    license: 'MED-71044',
    clinicId: 'clinic-1',
    clinicName: 'St. Jude Medical Center — Downtown Main Campus',
    avatar: 'JS',
    hours: 'Mon - Sat (08:00 AM - 02:00 PM)'
  },
  {
    id: 'user-doctor-3',
    email: 'vance@healthcare.com',
    password: 'doctor123',
    role: 'doctor',
    doctorId: 'doc-3',
    name: 'Dr. Elena Vance, MD',
    specialty: 'Dermatology',
    license: 'MED-90218',
    clinicId: 'clinic-2',
    clinicName: 'Metropolitan Health Pavilion & Urgent Care',
    avatar: 'EV',
    hours: 'Tue - Thu (10:00 AM - 05:00 PM)'
  },
  {
    id: 'user-admin-1',
    email: 'admin@healthcare.com',
    password: 'admin123',
    role: 'admin',
    name: 'Dr. Evelyn Reed',
    title: 'Chief Medical Operations Director',
    department: 'Hospital Administration & Clinical Quality',
    avatar: 'ER'
  }
];

// ============================================================================
// 2. CLINICS DATA
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
    doctors: ['Dr. Sarah Ramos, MD', 'Dr. Julian Santos, MD'],
    description: 'Premier tertiary healthcare facility featuring advanced cardiac diagnostics, clinical labs, and outpatient specialty suites.',
    accessibility: 'Wheelchair accessible, dedicated handicap parking, multilingual staff.'
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
    doctors: ['Dr. Elena Vance, MD', 'Dr. Arthur Davies, MD', 'Dr. Julian Santos, MD'],
    description: 'Comprehensive outpatient pavilion offering walk-in urgent care, dermatology laser suites, and family pediatric checkups.',
    accessibility: 'Ramp entry, braille signage, telehealth kiosks.'
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
    doctors: ['Dr. Sarah Ramos, MD', 'Dr. Marcus Chen, MD', 'Dr. Olivia Lin, MD'],
    description: 'Specialized clinical research and neurology center with high-resolution MRI and orthopedic joint rehabilitation.',
    accessibility: 'Elevators to all floors, hearing loop installed.'
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
    doctors: ['Dr. Arthur Davies, MD', 'Dr. Olivia Lin, MD'],
    description: 'Family-centered clinic with dedicated pediatric suites, adolescent counselling, and routine immunization services.',
    accessibility: 'Stroller-friendly wide doors, child play area, sensory room.'
  }
];

// ============================================================================
// 3. DOCTORS DATA
// ============================================================================
const DOCTORS_DATA = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Ramos, MD',
    specialty: 'Cardiology',
    subSpecialty: 'Cardiology & Cardiovascular Care',
    photo: 'images/doctor 1.jpg',
    rating: 4.9,
    reviewsCount: 128,
    experience: '14 years clinical experience',
    license: 'MED-84920',
    clinicId: 'clinic-1',
    clinicName: 'St. Jude Medical Center — Downtown Main Campus',
    telehealth: true,
    inPerson: true,
    availableToday: true,
    hours: 'Mon - Fri (09:00 AM - 04:00 PM)',
    languages: ['English', 'Spanish'],
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
    experience: '11 years clinical experience',
    license: 'MED-71044',
    clinicId: 'clinic-1',
    clinicName: 'St. Jude Medical Center — Downtown Main Campus',
    telehealth: true,
    inPerson: true,
    availableToday: true,
    hours: 'Mon - Sat (08:00 AM - 02:00 PM)',
    languages: ['English', 'Tagalog'],
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
    experience: '12 years clinical experience',
    license: 'MED-90218',
    clinicId: 'clinic-2',
    clinicName: 'Metropolitan Health Pavilion & Urgent Care',
    telehealth: true,
    inPerson: true,
    availableToday: false,
    hours: 'Tue - Thu (10:00 AM - 05:00 PM)',
    languages: ['English', 'French'],
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
    experience: '16 years clinical experience',
    license: 'MED-63109',
    clinicId: 'clinic-2',
    clinicName: 'Metropolitan Health Pavilion & Urgent Care',
    telehealth: true,
    inPerson: true,
    availableToday: true,
    hours: 'Mon - Fri (09:00 AM - 03:00 PM)',
    languages: ['English'],
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
    experience: '9 years clinical experience',
    license: 'MED-77402',
    clinicId: 'clinic-3',
    clinicName: 'Upper East Specialty Care & Diagnostics',
    telehealth: false,
    inPerson: true,
    availableToday: false,
    hours: 'Wed - Sat (08:30 AM - 03:30 PM)',
    languages: ['English', 'Mandarin'],
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
    experience: '13 years clinical experience',
    license: 'MED-58219',
    clinicId: 'clinic-3',
    clinicName: 'Upper East Specialty Care & Diagnostics',
    telehealth: true,
    inPerson: true,
    availableToday: true,
    hours: 'Mon - Thu (09:30 AM - 04:30 PM)',
    languages: ['English', 'Cantonese'],
    bio: 'Neurologist with specialized focus on chronic migraine management, neuropathy, neuro-diagnostics, and cognitive health assessments.',
    education: 'Yale School of Medicine'
  }
];

// ============================================================================
// 4. SERVICES DATA
// ============================================================================
const SERVICES_DATA = [
  { id: 'srv-1', name: 'Cardiology', title: 'Cardiology Consultation', desc: 'Heart rhythm evaluation, ECG, blood pressure management, and cardiovascular wellness', fee: '$150', time: '45 mins' },
  { id: 'srv-2', name: 'General Medicine', title: 'General Internal Medicine', desc: 'Routine health checkup, physical diagnostics, wellness clearance, and lab reviews', fee: '$95', time: '30 mins' },
  { id: 'srv-3', name: 'Dermatology', title: 'Dermatology & Skin Care', desc: 'Skin lesion inspection, rash treatment, acne management, and mole checks', fee: '$120', time: '30 mins' },
  { id: 'srv-4', name: 'Pediatrics', title: 'Pediatrics Wellness Check', desc: 'Child health screening, immunizations, developmental review, and acute illness care', fee: '$100', time: '30 mins' },
  { id: 'srv-5', name: 'Orthopedics', title: 'Orthopedics & Joint Clinic', desc: 'Joint pain examination, mobility testing, sports injury review, and physical therapy plans', fee: '$140', time: '40 mins' },
  { id: 'srv-6', name: 'Neurology', title: 'Neurology & Headache Clinic', desc: 'Migraine protocol, nerve conductivity check, dizziness review, and memory screening', fee: '$160', time: '45 mins' }
];

// ============================================================================
// 5. APPOINTMENTS STORE WITH STATUS HISTORY TRAIL
// ============================================================================
const DEFAULT_APPOINTMENTS = [
  {
    id: 1,
    refCode: 'APT-2026-8491',
    patientId: 'PT-1042',
    patientName: 'Mariane Millera',
    email: 'patient@healthcare.com',
    phone: '+1 (555) 019-2834',
    doctor: 'Dr. Sarah Ramos, MD',
    doctorId: 'doc-1',
    specialty: 'Cardiology',
    clinic: 'St. Jude Medical Center — Downtown Main Campus',
    clinicAddress: '450 Lexington Ave, Suite 400, New York',
    date: '2026-10-08',
    time: '10:30 AM',
    type: 'Telehealth',
    status: 'approved', // 'pending', 'approved', 'completed', 'cancelled', 'rescheduled'
    reason: 'Follow-up on resting heart rate rhythm and mild chest tightness after light exercise.',
    notes: 'Patient advised to monitor systolic BP twice daily. Telehealth ECG review planned.',
    history: [
      { status: 'Requested', time: 'Oct 1, 2026 09:15 AM', by: 'Mariane Millera' },
      { status: 'Confirmed', time: 'Oct 1, 2026 10:20 AM', by: 'Dr. Sarah Ramos, MD' }
    ]
  },
  {
    id: 2,
    refCode: 'APT-2026-8102',
    patientId: 'PT-1088',
    patientName: 'Trish Anne Revilla',
    email: 'trish.revilla@gmail.com',
    phone: '+1 (555) 019-0841',
    doctor: 'Dr. Julian Santos, MD',
    doctorId: 'doc-2',
    specialty: 'General Medicine',
    clinic: 'Metropolitan Health Pavilion & Urgent Care',
    clinicAddress: '120 E 34th St, New York',
    date: '2026-10-12',
    time: '02:00 PM',
    type: 'In-Person',
    status: 'pending',
    reason: 'Annual preventive bloodwork panel and comprehensive wellness review.',
    notes: '',
    history: [
      { status: 'Requested', time: 'Oct 2, 2026 11:45 AM', by: 'Trish Anne Revilla' }
    ]
  },
  {
    id: 3,
    refCode: 'APT-2026-7934',
    patientId: 'PT-1042',
    patientName: 'Mariane Millera',
    email: 'patient@healthcare.com',
    phone: '+1 (555) 019-2834',
    doctor: 'Dr. Elena Vance, MD',
    doctorId: 'doc-3',
    specialty: 'Dermatology',
    clinic: 'Metropolitan Health Pavilion & Urgent Care',
    clinicAddress: '120 E 34th St, New York',
    date: '2026-09-22',
    time: '11:15 AM',
    type: 'In-Person',
    status: 'completed',
    reason: 'Routine seasonal eczema review and topical cream prescription.',
    notes: 'Prescribed Hydrocortisone 1% topical cream for 14 days. Symptoms resolved.',
    review: {
      rating: 5,
      comment: 'Dr. Vance was extremely thorough and gentle. My skin cleared up within a week!',
      date: '2026-09-23'
    },
    history: [
      { status: 'Requested', time: 'Sep 18, 2026 08:30 AM', by: 'Mariane Millera' },
      { status: 'Confirmed', time: 'Sep 18, 2026 09:10 AM', by: 'Dr. Elena Vance, MD' },
      { status: 'Completed', time: 'Sep 22, 2026 11:50 AM', by: 'Dr. Elena Vance, MD' }
    ]
  },
  {
    id: 4,
    refCode: 'APT-2026-7450',
    patientId: 'PT-1102',
    patientName: 'David Miller',
    email: 'david.m@gmail.com',
    phone: '+1 (555) 019-5432',
    doctor: 'Dr. Arthur Davies, MD',
    doctorId: 'doc-4',
    specialty: 'Pediatrics',
    clinic: 'Riverside Pediatrics & Family Health',
    clinicAddress: '210 Riverside Dr, New York',
    date: '2026-09-15',
    time: '09:00 AM',
    type: 'In-Person',
    status: 'completed',
    reason: 'Annual school health and sports clearance exam.',
    notes: 'Height: 52in, Weight: 64lbs. Vitals healthy. Sports clearance form issued.',
    history: [
      { status: 'Requested', time: 'Sep 10, 2026 02:00 PM', by: 'Parent' },
      { status: 'Confirmed', time: 'Sep 10, 2026 03:00 PM', by: 'Dr. Arthur Davies, MD' },
      { status: 'Completed', time: 'Sep 15, 2026 09:40 AM', by: 'Dr. Arthur Davies, MD' }
    ]
  }
];

// ============================================================================
// 6. MESSAGING SYSTEM DATA
// ============================================================================
const DEFAULT_CONVERSATIONS = [
  {
    id: 'conv-1',
    patientId: 'PT-1042',
    patientName: 'Mariane Millera',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Ramos, MD',
    specialty: 'Cardiology',
    lastMessage: 'Please remember to log your resting heart rate morning and night.',
    lastTime: '10:45 AM',
    unreadCount: 1,
    messages: [
      { sender: 'doctor', text: 'Hello Mariane, I reviewed your previous ECG logs. Everything looks stable, but please continue tracking.', time: 'Yesterday 04:15 PM' },
      { sender: 'patient', text: 'Thank you Dr. Ramos! Should I take my usual medication before the Telehealth call on Thursday?', time: 'Yesterday 05:20 PM' },
      { sender: 'doctor', text: 'Yes, please take your regular morning dose with water as usual.', time: 'Today 08:30 AM' },
      { sender: 'doctor', text: 'Please remember to log your resting heart rate morning and night.', time: '10:45 AM' }
    ]
  },
  {
    id: 'conv-2',
    patientId: 'PT-1042',
    patientName: 'Mariane Millera',
    doctorId: 'doc-2',
    doctorName: 'Dr. Julian Santos, MD',
    specialty: 'General Medicine',
    lastMessage: 'Your annual metabolic panel results have been uploaded to your health documents.',
    lastTime: 'Oct 2',
    unreadCount: 0,
    messages: [
      { sender: 'doctor', text: 'Good morning Mariane, your annual blood panel came back normal across all markers.', time: 'Oct 2 09:00 AM' },
      { sender: 'doctor', text: 'Your annual metabolic panel results have been uploaded to your health documents.', time: 'Oct 2 09:02 AM' },
      { sender: 'patient', text: 'Thank you Dr. Santos, much appreciated!', time: 'Oct 2 10:15 AM' }
    ]
  }
];

// ============================================================================
// 7. NOTIFICATIONS STORE
// ============================================================================
const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'user-patient-1',
    role: 'patient',
    title: 'Consultation Confirmed',
    message: 'Your Telehealth appointment with Dr. Sarah Ramos is confirmed for Oct 8 at 10:30 AM.',
    time: '10 mins ago',
    read: false,
    type: 'appointment'
  },
  {
    id: 'notif-2',
    userId: 'user-patient-1',
    role: 'patient',
    title: 'New Clinical Note',
    message: 'Dr. Julian Santos posted new laboratory interpretations to your health record.',
    time: '2 hours ago',
    read: false,
    type: 'medical'
  },
  {
    id: 'notif-3',
    userId: 'user-doctor-1',
    role: 'doctor',
    title: 'New Appointment Request',
    message: 'Trish Anne Revilla requested a General Medicine consultation for Oct 12.',
    time: '1 hour ago',
    read: false,
    type: 'appointment'
  },
  {
    id: 'notif-4',
    userId: 'user-admin-1',
    role: 'admin',
    title: 'Provider License Verified',
    message: 'Dr. Elena Vance (MED-90218) annual accreditation was successfully updated.',
    time: '3 hours ago',
    read: false,
    type: 'compliance'
  }
];

// ============================================================================
// 8. AUDIT LOGS (ADMIN ONLY)
// ============================================================================
const DEFAULT_AUDIT_LOGS = [
  { id: 'log-1', action: 'Appointment Booked', target: 'APT-2026-8491 (Mariane Millera / Dr. Ramos)', user: 'patient@healthcare.com', timestamp: '2026-10-01 09:15:22' },
  { id: 'log-2', action: 'Doctor Status Verified', target: 'Dr. Elena Vance (MED-90218)', user: 'admin@healthcare.com', timestamp: '2026-10-01 11:40:05' },
  { id: 'log-3', action: 'Clinic Operating Hours Updated', target: 'Metropolitan Health Pavilion', user: 'admin@healthcare.com', timestamp: '2026-10-02 14:10:19' },
  { id: 'log-4', action: 'Prescription Issued', target: 'Atorvastatin 20mg (#PT-1042)', user: 'doctor@healthcare.com', timestamp: '2026-10-02 16:32:00' }
];

// ============================================================================
// 9. CENTRALIZED APP DATA MANAGER CLASS
// ============================================================================
class HealthcareDataManager {
  constructor() {
    this.session = this.load('hc_session', null);
    this.appointments = this.load('hc_appointments', DEFAULT_APPOINTMENTS);
    this.conversations = this.load('hc_conversations', DEFAULT_CONVERSATIONS);
    this.notifications = this.load('hc_notifications', DEFAULT_NOTIFICATIONS);
    this.auditLogs = this.load('hc_audit_logs', DEFAULT_AUDIT_LOGS);
    this.savedDoctors = this.load('hc_saved_docs', ['doc-1', 'doc-3']);
    this.savedClinics = this.load('hc_saved_clinics', ['clinic-1']);
    this.waitlists = this.load('hc_waitlists', []);
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
  }

  // --- Session & Authentication ---
  login(email, password) {
    const user = DEMO_ACCOUNTS.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password);
    if (user) {
      this.session = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        doctorId: user.doctorId || null,
        patientId: user.patientId || null,
        avatar: user.avatar,
        title: user.title || user.specialty || ''
      };
      this.save('hc_session', this.session);
      return { success: true, user: this.session };
    }
    return { success: false, error: 'Invalid email or password.' };
  }

  logout() {
    this.session = null;
    localStorage.removeItem('hc_session');
    window.location.href = 'login.html';
  }

  getSession() {
    return this.session;
  }

  requireAuth(requiredRole, redirectOnFail = true) {
    if (!this.session) {
      if (redirectOnFail) {
        window.location.href = 'login.html?notice=unauthorized';
      }
      return false;
    }
    if (requiredRole && this.session.role !== requiredRole) {
      if (redirectOnFail) {
        // Redirect to their actual role dashboard
        if (this.session.role === 'patient') window.location.href = 'patient.html';
        else if (this.session.role === 'doctor') window.location.href = 'doctor.html';
        else if (this.session.role === 'admin') window.location.href = 'admin.html';
        else window.location.href = 'login.html';
      }
      return false;
    }
    return true;
  }

  // --- Conflict Prevention & Availability Engine ---
  isSlotAvailable(doctorName, date, time) {
    return !this.appointments.some(a => 
      a.doctor === doctorName && 
      a.date === date && 
      a.time === time && 
      a.status !== 'cancelled'
    );
  }

  // --- Appointments Management ---
  createAppointment(apptData) {
    // Conflict check
    if (!this.isSlotAvailable(apptData.doctor, apptData.date, apptData.time)) {
      return { success: false, error: 'This time slot was just booked by another patient. Please choose another slot.' };
    }

    const ref = `APT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppt = {
      id: Date.now(),
      refCode: ref,
      patientId: apptData.patientId || 'PT-1042',
      patientName: apptData.patientName,
      email: apptData.email,
      phone: apptData.phone,
      doctor: apptData.doctor,
      doctorId: apptData.doctorId || 'doc-1',
      specialty: apptData.specialty,
      clinic: apptData.clinic,
      clinicAddress: apptData.clinicAddress || apptData.clinic,
      date: apptData.date,
      time: apptData.time,
      type: apptData.type,
      status: 'approved',
      reason: apptData.reason,
      notes: '',
      history: [
        { status: 'Requested', time: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), by: apptData.patientName },
        { status: 'Confirmed', time: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), by: apptData.doctor }
      ]
    };

    this.appointments.unshift(newAppt);
    this.save('hc_appointments', this.appointments);

    // Add Audit Log
    this.addAuditLog('Appointment Created', `${newAppt.refCode} with ${newAppt.doctor} for ${newAppt.patientName}`, apptData.email);

    // Notify patient
    this.addNotification({
      userId: this.session?.id || 'user-patient-1',
      role: 'patient',
      title: 'Appointment Confirmed',
      message: `Your ${newAppt.type} visit with ${newAppt.doctor} on ${newAppt.date} at ${newAppt.time} is confirmed. Ref: ${newAppt.refCode}`,
      type: 'appointment'
    });

    return { success: true, appointment: newAppt };
  }

  updateAppointmentStatus(id, newStatus, actorName = 'Medical Staff', note = '') {
    this.appointments = this.appointments.map(a => {
      if (a.id === id) {
        const hist = a.history || [];
        hist.push({
          status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
          time: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          by: actorName,
          note: note
        });
        return {
          ...a,
          status: newStatus,
          notes: note ? note : a.notes,
          history: hist
        };
      }
      return a;
    });
    this.save('hc_appointments', this.appointments);
    this.addAuditLog(`Appointment ${newStatus}`, `Appointment #${id} updated to ${newStatus} by ${actorName}`, actorName);
  }

  rescheduleAppointment(id, newDate, newTime, actorName = 'Mariane Millera') {
    const appt = this.appointments.find(a => a.id === id);
    if (!appt) return false;

    if (!this.isSlotAvailable(appt.doctor, newDate, newTime)) {
      return { success: false, error: 'Chosen rescheduled slot is already occupied.' };
    }

    appt.date = newDate;
    appt.time = newTime;
    appt.status = 'approved';
    appt.history = appt.history || [];
    appt.history.push({
      status: 'Rescheduled',
      time: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      by: actorName,
      note: `Moved to ${newDate} at ${newTime}`
    });

    this.save('hc_appointments', this.appointments);
    this.addAuditLog('Appointment Rescheduled', `${appt.refCode} rescheduled to ${newDate} ${newTime}`, actorName);
    return { success: true };
  }

  submitAppointmentReview(id, rating, comment) {
    this.appointments = this.appointments.map(a => {
      if (a.id === id) {
        return {
          ...a,
          review: {
            rating: rating,
            comment: comment,
            date: new Date().toISOString().split('T')[0]
          }
        };
      }
      return a;
    });
    this.save('hc_appointments', this.appointments);
  }

  // --- Waitlist ---
  joinWaitlist(doctorName, specialty, preferredDate, patientEmail) {
    const entry = {
      id: Date.now(),
      doctor: doctorName,
      specialty: specialty,
      date: preferredDate,
      email: patientEmail,
      createdAt: new Date().toISOString()
    };
    this.waitlists.push(entry);
    this.save('hc_waitlists', this.waitlists);
    return true;
  }

  // --- Saved / Favorites ---
  toggleSaveDoctor(docId) {
    if (this.savedDoctors.includes(docId)) {
      this.savedDoctors = this.savedDoctors.filter(id => id !== docId);
    } else {
      this.savedDoctors.push(docId);
    }
    this.save('hc_saved_docs', this.savedDoctors);
    return this.savedDoctors.includes(docId);
  }

  isDoctorSaved(docId) {
    return this.savedDoctors.includes(docId);
  }

  // --- Messaging System ---
  sendMessage(conversationId, text, senderRole = 'patient') {
    const conv = this.conversations.find(c => c.id === conversationId);
    if (!conv) return false;

    const newMsg = {
      sender: senderRole,
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    conv.messages.push(newMsg);
    conv.lastMessage = text;
    conv.lastTime = newMsg.time;
    if (senderRole === 'patient') {
      conv.unreadCount = 1;
    }

    this.save('hc_conversations', this.conversations);
    return newMsg;
  }

  // --- Notifications ---
  addNotification(notif) {
    const item = {
      id: `notif-${Date.now()}`,
      time: 'Just now',
      read: false,
      ...notif
    };
    this.notifications.unshift(item);
    this.save('hc_notifications', this.notifications);
  }

  // --- Audit Logs ---
  addAuditLog(action, target, user) {
    const log = {
      id: `log-${Date.now()}`,
      action: action,
      target: target,
      user: user,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    this.auditLogs.unshift(log);
    this.save('hc_audit_logs', this.auditLogs);
  }
}

// Global Core Store Instance
window.HC_CORE = new HealthcareDataManager();
