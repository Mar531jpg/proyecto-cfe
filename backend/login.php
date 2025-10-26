<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once 'config.php';

$RPE = $_POST['rpe'] ?? '';
$contrasena = $_POST['password'] ?? '';

if (empty($RPE) || empty($contrasena)) {
    echo json_encode(['Result' => 0, 'Message' => 'Por favor rellena todos los campos']);
    exit;
}

$conexion = new mysqli($DB_SERVIDOR, $DB_USUARIO, $DB_CLAVE, $DB_NOMBRE, $DB_PUERTO);

if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(['Result' => 0, 'Message' => 'Error de conexión: ' . $conexion->connect_error]);
    exit;
}

$storedProcedure = $conexion->prepare("CALL LoginUsuario(?, ?)");
if (!$storedProcedure) {
    echo json_encode(['Result' => 0, 'Message' => 'Error al preparar la consulta: ' . $conexion->error]);
    exit;
}

$storedProcedure->bind_param("ss", $RPE, $contrasena);
$storedProcedure->execute();

$resultado = $storedProcedure->get_result();

if ($resultado && $datos = $resultado->fetch_assoc()) {
    echo json_encode([
        'Result' => $datos['Resultado'], 
        'Message' => $datos['Mensaje'],
        'Datos' => $datos
    ]);
} else {
    echo json_encode(['Result' => 0, 'Message' => 'Usuario o contraseña incorrectos']);
}

$storedProcedure->close();
$conexion->close();
?>
