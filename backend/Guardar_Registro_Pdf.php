<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once 'config.php';

$nombre = $_POST['Nombre'] ?? null;
$apellidoPaterno = $_POST['ApellidoPaterno'] ?? null;
$apellidoMaterno = $_POST['ApellidoMaterno'] ?? null;
$totalDesayuno = $_POST['TotalDesayuno'] ?? null;
$totalComida = $_POST['TotalComida'] ?? null;
$totalCena = $_POST['TotalCena'] ?? null;

if (!$nombre || !$apellidoPaterno || !$apellidoMaterno || $totalDesayuno === null || $totalComida === null || $totalCena === null) {
    http_response_code(400);
    echo json_encode(['Result' => 0, 'Message' => 'Faltan parámetros obligatorios.']);
    exit;
}

$conexion = new mysqli($DB_SERVIDOR, $DB_USUARIO, $DB_CLAVE, $DB_NOMBRE, $DB_PUERTO);

if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(['Result' => 0, 'Message' => 'Error de conexión: ' . $conexion->connect_error]);
    exit;
}

$storedProcedure = $conexion->prepare("CALL GuardarRegistroPDF(?, ?, ?, ?, ?, ?)");
if (!$storedProcedure) {
    echo json_encode(['Result' => 0, 'Message' => 'Error al preparar la consulta: ' . $conexion->error]);
    exit;
}

$storedProcedure->bind_param(
    "sssddd", 
    $nombre, 
    $apellidoPaterno, 
    $apellidoMaterno, 
    $totalDesayuno, 
    $totalComida, 
    $totalCena
);

if ($storedProcedure->execute()) {
    echo json_encode(['Result' => 1, 'Message' => 'Registro guardado correctamente.']);
} else {
    echo json_encode(['Result' => 0, 'Message' => 'Error al guardar el registro: ' . $storedProcedure->error]);
}

$storedProcedure->close();
$conexion->close();
?>
