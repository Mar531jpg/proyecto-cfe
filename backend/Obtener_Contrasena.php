<?php
header('Content-Type: application/json');
require_once 'config.php';

$id = $_GET['Id'] ?? null;
if(!$id){
    echo json_encode(['Result'=>0,'Message'=>'Id de usuario no proporcionado']);
    exit;
}

$conexion = new mysqli($DB_SERVIDOR,$DB_USUARIO,$DB_CLAVE,$DB_NOMBRE,$DB_PUERTO);
if($conexion->connect_error){
    echo json_encode(['Result'=>0,'Message'=>'Error de conexión']);
    exit;
}

$sp = $conexion->prepare("CALL Obtener_Contrasena(?)");
$sp->bind_param("i",$id);
$sp->execute();
$result = $sp->get_result();
$usuario = $result->fetch_assoc();

echo json_encode(['Result'=>1, 'Contrasena'=> $usuario['Contrasena'] ?? '']);

$sp->close();
$conexion->close();
?>
