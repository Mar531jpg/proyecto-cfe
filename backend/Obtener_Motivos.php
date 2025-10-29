<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once 'config.php';

$conexion = new mysqli($DB_SERVIDOR, $DB_USUARIO, $DB_CLAVE, $DB_NOMBRE, $DB_PUERTO);

if ($conexion->connect_error) {
    http_response_code(500);
    echo json_encode(['Result' => 0, 'Message' => 'Error de conexión: ' . $conexion->connect_error]);
    exit;
}

$storedProcedure = $conexion->prepare("CALL ObtenerMotivos()");
if (!$storedProcedure) {
    echo json_encode(['Result' => 0, 'Message' => 'Error al preparar la consulta: ' . $conexion->error]);
    exit;
}

$storedProcedure->execute();
$resultado = $storedProcedure->get_result();

$motivos = [];
while ($fila = $resultado->fetch_assoc()) {
    $motivos[] = $fila;
}

echo json_encode(['Result' => 1, 'Motivos' => $motivos]);

$storedProcedure->close();
$conexion->close();
?>
