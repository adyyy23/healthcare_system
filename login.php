<?php
session_start();
require_once 'config/database.php';

$error = null;
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if ($pdo) {
        try {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['user_name'] = $user['name'];
                
                switch($user['role']) {
                    case 'admin':
                        header('Location: admin/dashboard.php');
                        break;
                    case 'doctor':
                        header('Location: doctor/dashboard.php');
                        break;
                    case 'patient':
                    default:
                        header('Location: patient/dashboard.php');
                        break;
                }
                exit();
            } else {
                $error = "Invalid email or password credentials.";
            }
        } catch(PDOException $e) {
            $error = "Authentication service error: " . $e->getMessage();
        }
    } else {
        // Safe demo fallback when local database server is unconfigured
        if (!empty($email) && !empty($password)) {
            $_SESSION['user_id'] = 1;
            $_SESSION['role'] = 'patient';
            $_SESSION['user_name'] = 'Mariane Millera';
            header('Location: index.html?role=patient');
            exit();
        } else {
            $error = "Please provide an email and password.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Sign In — HealthCare Clinical Portal</title>
  
  <!-- PWA Manifest & Meta -->
  <link rel="manifest" href="manifest.webmanifest">
  <meta name="theme-color" content="#2563eb">
  <link rel="apple-touch-icon" href="assets/icons/apple-touch-icon.png">
  <link rel="icon" type="image/svg+xml" href="assets/icons/icon.svg">

  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <!-- Google Fonts: Plus Jakarta Sans & Inter -->
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
      max-width: 440px;
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
      <h1 style="font-size: 1.375rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em;">Welcome to HealthCare</h1>
      <p style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 4px;">Sign in to access your consultations and medical records</p>
    </div>

    <?php if ($error): ?>
      <div style="padding: 12px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: var(--radius-md); color: #dc2626; font-size: 0.8125rem; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
        <i data-lucide="alert-circle" style="width: 16px; height: 16px; flex-shrink: 0;"></i>
        <span><?php echo htmlspecialchars($error); ?></span>
      </div>
    <?php endif; ?>

    <form method="POST" action="">
      <div class="form-field" style="margin-bottom: 16px;">
        <label class="form-label">Email Address</label>
        <div style="position: relative;">
          <i data-lucide="mail" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
          <input type="email" name="email" required class="form-input" style="padding-left: 42px;" placeholder="name@healthcare.com" value="mariane.millera@gmail.com">
        </div>
      </div>

      <div class="form-field" style="margin-bottom: 24px;">
        <label class="form-label">Password</label>
        <div style="position: relative;">
          <i data-lucide="lock" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: var(--text-muted);"></i>
          <input type="password" name="password" required class="form-input" style="padding-left: 42px;" placeholder="••••••••" value="password123">
        </div>
      </div>

      <button type="submit" class="bubble-btn bubble-btn-primary" style="width: 100%; padding: 12px; justify-content: center; font-size: 0.9375rem;">
        Sign In to Portal
      </button>
    </form>

    <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-subtle); font-size: 0.8125rem; color: var(--text-muted);">
      Don't have a patient account? <a href="signup.php" style="color: var(--accent-primary); font-weight: 700;">Create Account</a>
    </div>

    <div style="text-align: center; margin-top: 16px;">
      <a href="index.html" style="font-size: 0.75rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 4px;">
        <i data-lucide="arrow-left" style="width: 12px; height: 12px;"></i> Back to Public Clinic Explorer
      </a>
    </div>
  </div>

  <script>
    if (window.lucide) window.lucide.createIcons();
  </script>
</body>
</html>