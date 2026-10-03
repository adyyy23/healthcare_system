<?php
ob_start();
session_start();
require_once 'config/database.php';

$error = null;
$success = null;

$adminCount = 0;
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE role = 'admin'");
        $adminCount = $stmt->fetchColumn();
    } catch(PDOException $e) {
        $adminCount = 0;
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $requestedRole = $_POST['role'] ?? 'patient';
    
    // Hash password securely
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $role = ($adminCount > 0 && $requestedRole === 'admin') ? 'patient' : $requestedRole;
    
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)");
            $stmt->execute([$name, $email, $hashedPassword, $role]);
            $newUserId = $pdo->lastInsertId();
            
            if ($role === 'doctor') {
                $spec = $_POST['specialization'] ?? 'General Medicine';
                $lic = $_POST['license_number'] ?? 'MED-' . rand(10000, 99999);
                $stmtDoc = $pdo->prepare("INSERT INTO doctors (user_id, specialization, license_number) VALUES (?, ?, ?)");
                $stmtDoc->execute([$newUserId, $spec, $lic]);
            } else if ($role === 'patient') {
                $stmtPat = $pdo->prepare("INSERT INTO patients (user_id) VALUES (?)");
                $stmtPat->execute([$newUserId]);
            }
            
            $_SESSION['user_id'] = $newUserId;
            $_SESSION['role'] = $role;
            $_SESSION['user_name'] = $name;
            
            switch($role) {
                case 'admin':
                    header('Location: admin/dashboard.php');
                    break;
                case 'doctor':
                    header('Location: doctor/dashboard.php');
                    break;
                default:
                    header('Location: patient/dashboard.php');
                    break;
            }
            exit();
        } catch(PDOException $e) {
            $error = "Registration error: " . $e->getMessage();
        }
    } else {
        // Fallback for demo when MySQL is not running
        $_SESSION['user_id'] = 101;
        $_SESSION['role'] = $role;
        $_SESSION['user_name'] = $name;
        header('Location: index.html?role=patient');
        exit();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Create Account — HealthCare Clinical Portal</title>
  
  <link rel="manifest" href="manifest.webmanifest">
  <meta name="theme-color" content="#2563eb">
  <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
  <link rel="icon" type="image/svg+xml" href="assets/icons/icon.svg">

  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <link rel="stylesheet" href="assets/css/design-system.css">
  
  <style>
    body {
      background: var(--bg-app);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px 16px;
    }
    .auth-card {
      width: 100%;
      max-width: 480px;
      background: #ffffff;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: 36px 28px;
      box-shadow: var(--shadow-floating);
      animation: fadeInStep 0.25s ease;
    }
  </style>
</head>
<body>

  <div class="auth-card">
    <div style="text-align: center; margin-bottom: 28px;">
      <div class="brand-logo-bubble" style="width: 52px; height: 52px; margin: 0 auto 14px; border-radius: var(--radius-lg);">
        <i data-lucide="plus" style="width: 28px; height: 28px; stroke-width: 3;"></i>
      </div>
      <h1 style="font-size: 1.375rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em;">Create HealthCare Account</h1>
      <p style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 4px;">Join our patient and accredited clinical care network</p>
    </div>

    <?php if ($error): ?>
      <div style="padding: 12px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-md); color: #dc2626; font-size: 0.8125rem; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="alert-circle" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
        <span><?php echo htmlspecialchars($error); ?></span>
      </div>
    <?php endif; ?>

    <form method="POST" action="">
      <div class="form-field" style="margin-bottom: 14px;">
        <label class="form-label">Full Legal Name *</label>
        <input type="text" name="name" required class="form-input" placeholder="e.g. Mariane Millera">
      </div>

      <div class="form-field" style="margin-bottom: 14px;">
        <label class="form-label">Email Address *</label>
        <input type="email" name="email" required class="form-input" placeholder="patient@gmail.com">
      </div>

      <div class="form-field" style="margin-bottom: 14px;">
        <label class="form-label">Account Role</label>
        <select name="role" id="role-select" class="form-select" onchange="toggleDoctorFields(this.value)">
          <option value="patient" selected>Patient (Personal Health Record)</option>
          <option value="doctor">Medical Physician / Specialist</option>
          <?php if ($adminCount == 0): ?>
            <option value="admin">Hospital Administrator</option>
          <?php endif; ?>
        </select>
      </div>

      <div id="doctor-extra-fields" style="display: none; padding: 12px; background: #f8fafc; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 14px;">
        <div class="form-field" style="margin-bottom: 10px;">
          <label class="form-label">Clinical Specialization</label>
          <input type="text" name="specialization" class="form-input" placeholder="e.g. Cardiology">
        </div>
        <div class="form-field">
          <label class="form-label">Medical License Number</label>
          <input type="text" name="license_number" class="form-input" placeholder="e.g. MED-84920">
        </div>
      </div>

      <div class="form-field" style="margin-bottom: 24px;">
        <label class="form-label">Secure Password *</label>
        <input type="password" name="password" required class="form-input" placeholder="Minimum 8 characters">
      </div>

      <button type="submit" class="bubble-btn bubble-btn-primary" style="width: 100%; padding: 12px; justify-content: center; font-size: 0.9375rem;">
        Complete Registration
      </button>
    </form>

    <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-subtle); font-size: 0.8125rem; color: var(--text-muted);">
      Already have an account? <a href="login.php" style="color: var(--accent-primary); font-weight: 700;">Sign In</a>
    </div>
  </div>

  <script>
    function toggleDoctorFields(role) {
      const extra = document.getElementById('doctor-extra-fields');
      if (extra) extra.style.display = role === 'doctor' ? 'block' : 'none';
    }
    if (window.lucide) window.lucide.createIcons();
  </script>
</body>
</html>