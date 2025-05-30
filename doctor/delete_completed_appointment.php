<?php
// Start session and include database connection
session_start();
require_once '../config/database.php';

// Check if user is logged in and has doctor role
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'doctor') {
    header('Location: ../login.php');
    exit();
}

// Handle POST request to delete a completed appointment
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['appointment_id'])) {
    error_log('Received POST request to delete appointment with data: ' . json_encode($_POST));
    $appointment_id = $_POST['appointment_id'];
    
    // Validate appointment ID
    if (empty($appointment_id)) {
        error_log('Appointment ID is empty.');
        $_SESSION['error'] = 'Appointment ID is missing.';
        header('Location: dashboard.php');
        exit();
    }
    
    // Verify the appointment belongs to the logged-in doctor and is completed
    $stmt = $pdo->prepare('SELECT a.*, d.user_id as doctor_user_id FROM appointments a JOIN doctors d ON a.doctor_id = d.id WHERE a.id = ? AND a.status = ?');
    $stmt->execute([$appointment_id, 'completed']);
    $appointment = $stmt->fetch();
    
    if (!$appointment || $appointment['doctor_user_id'] != $_SESSION['user_id']) {
        error_log('Invalid appointment or user mismatch.');
        $_SESSION['error'] = 'Invalid appointment.';
        header('Location: dashboard.php');
        exit();
    }
    
    // Log appointment details for debugging
    error_log('Appointment details: ' . json_encode($appointment));
    
    // Delete the appointment from the database
    $stmt = $pdo->prepare('DELETE FROM appointments WHERE id = ?');
    $result = $stmt->execute([$appointment_id]);
    error_log('Appointment deletion result: ' . ($result ? 'success' : 'failed'));
    
    // Set success or error message based on deletion result
    if (!$result) {
        $_SESSION['error'] = 'Failed to delete appointment.';
    } else {
        $_SESSION['success'] = 'Completed appointment deleted.';
    }
    
    // Redirect back to the dashboard
    header('Location: dashboard.php');
    exit();
}

// Redirect to dashboard if accessed without POST data
header('Location: dashboard.php');
exit();
