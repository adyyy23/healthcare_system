<?php
session_start();
require_once 'config/database.php';

$featuredDoctors = [];
$services = [];

if ($pdo) {
    try {
        $stmt = $pdo->prepare("
            SELECT d.*, u.name, u.email, u.profile_image
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            WHERE d.is_featured = 1
            LIMIT 4
        ");
        $stmt->execute();
        $featuredDoctors = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stmt2 = $pdo->prepare("SELECT * FROM services WHERE is_active = 1");
        $stmt2->execute();
        $services = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        error_log("Database query exception: " . $e->getMessage());
    }
}

// Redirect or forward to index.html which hosts the unified client PWA and spatial experience
header('Location: index.html');
exit();
?>