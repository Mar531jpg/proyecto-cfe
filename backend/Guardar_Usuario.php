<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once 'config.php';

$conexion = new mysqli($DB_SERVIDOR, $DB_USUARIO, $DB_CLAVE, $DB_NOMBRE, $DB_PUERTO);

if ($conexion->connect_error) {
    echo json_encode(['Result' => 0, 'Message' => 'Error de conexión: ' . $conexion->connect_error]);
    exit;
}

// Obtener datos POST
$accion = $_POST['accion'] ?? '';
$datos = $_POST['datos'] ?? [];

$pId = $datos['Id'] ?? null;
$pNombre = $datos['Nombre'] ?? '';
$pApellidoPaterno = $datos['ApellidoPaterno'] ?? '';
$pApellidoMaterno = $datos['ApellidoMaterno'] ?? '';
$pRPE = $datos['RPE'] ?? '';
$pActivo = $datos['Activo'] ?? 1;
$pIdPuesto = $datos['IdPuesto'] ?? null;

if (!$pIdPuesto) {
    echo json_encode(['Result' => 0, 'Message' => 'Debe seleccionar un puesto']);
    exit;
}

// Preparar llamada al SP
$stmt = $conexion->prepare("CALL GuardarUsuario(?, ?, ?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(['Result' => 0, 'Message' => 'Error al preparar la consulta: ' . $conexion->error]);
    exit;
}

$stmt->bind_param("sissssii", $accion, $pId, $pNombre, $pApellidoPaterno, $pApellidoMaterno, $pRPE, $pActivo, $pIdPuesto);

if ($stmt->execute()) {
    $resultado = $stmt->get_result();
    if ($resultado && $fila = $resultado->fetch_assoc()) {
        echo json_encode($fila);
    } else {
        echo json_encode(['Result' => 1, 'Message' => $accion == 'Editar' ? 'Usuario actualizado correctamente' : 'Usuario agregado correctamente']);
    }
} else {
    echo json_encode(['Result' => 0, 'Message' => 'Error al ejecutar el procedimiento: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
