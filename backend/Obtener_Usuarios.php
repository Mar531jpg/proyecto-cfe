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

$storedProcedure = $conexion->prepare("CALL ObtenerUsuarios()");
if (!$storedProcedure) {
    echo json_encode(['Result' => 0, 'Message' => 'Error al preparar la consulta: ' . $conexion->error]);
    exit;
}

if (!$storedProcedure->execute()) {
    echo json_encode(['Result' => 0, 'Message' => 'Error al ejecutar la consulta: ' . $storedProcedure->error]);
    $storedProcedure->close();
    $conexion->close();
    exit;
}

$resultado = $storedProcedure->get_result();

$usuarios = [];
while ($fila = $resultado->fetch_assoc()) {
    $usuarios[] = $fila;
}

echo json_encode(['Result' => 1, 'Usuarios' => $usuarios]);

$storedProcedure->close();
$conexion->close();
?>
