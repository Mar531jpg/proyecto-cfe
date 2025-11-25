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

$pId = $_POST['id'] ?? 0;

$stmt = $conexion->prepare("CALL EliminarUsuario(?)");
if (!$stmt) {
    echo json_encode(['Result' => 0, 'Message' => 'Error al preparar la consulta: ' . $conexion->error]);
    exit;
}

$stmt->bind_param("i", $pId);

if ($stmt->execute()) {
    $resultado = $stmt->get_result();
    if ($resultado && $fila = $resultado->fetch_assoc()) {
        echo json_encode($fila);
    } else {
        echo json_encode(['Result' => 1, 'Message' => 'Usuario eliminado correctamente']);
    }
} else {
    echo json_encode(['Result' => 0, 'Message' => 'Error al ejecutar el procedimiento: ' . $stmt->error]);
}

$stmt->close();
$conexion->close();
?>
