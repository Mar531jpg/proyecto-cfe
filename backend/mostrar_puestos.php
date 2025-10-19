<?php
    
require_once 'config.php';


$conexion = new mysqli($DB_SERVIDOR, $DB_USUARIO, $DB_CLAVE, $DB_NOMBRE, $DB_PUERTO);

if ($conexion->connect_error) {
    http_response_code(500); 
    echo json_encode([
        'Result' => 0,
        'Message' => 'Error de conexión: ' . $conexion->connect_error
    ]);
    exit;
}

$storedProcedure = $conexion->prepare("CALL GetPuestosCFE()");

if (!$storedProcedure) {
    echo json_encode([
        'Result' => 0,
        'Message' => 'Error al preparar la consulta: ' . $conexion->error
    ]);
    exit;
}

$storedProcedure->execute();

$resultado = $storedProcedure->get_result();
$datos = $resultado->fetch_assoc();

echo json_encode($datos);

$storedProcedure->close();
$conexion->close();

?>