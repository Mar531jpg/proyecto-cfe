<?php
header('Content-Type: application/json');
require_once 'config.php';

$id = $_POST['Id'] ?? null;
$contrasenaActual = $_POST['contrasenaActual'] ?? null;
$nuevaContrasena = $_POST['nuevaContrasena'] ?? null;

if(!$id || !$nuevaContrasena){
    echo json_encode(['Result'=>0,'Message'=>'Datos incompletos']);
    exit;
}

$conexion = new mysqli($DB_SERVIDOR,$DB_USUARIO,$DB_CLAVE,$DB_NOMBRE,$DB_PUERTO);
if($conexion->connect_error){
    echo json_encode(['Result'=>0,'Message'=>'Error de conexión']);
    exit;
}

$sp = $conexion->prepare("CALL Guardar_Contrasena(?,?,?)");
$sp->bind_param("iss",$id,$contrasenaActual,$nuevaContrasena);

if($sp->execute()){
    $resultado = $sp->get_result();
    if($fila = $resultado->fetch_assoc()){
        echo json_encode(['Result'=>$fila['Result'],'Message'=>$fila['Message']]);
    } else {
        echo json_encode(['Result'=>0,'Message'=>'Error al procesar la respuesta del servidor']);
    }
} else {
    echo json_encode(['Result'=>0,'Message'=>'Error al ejecutar el procedimiento']);
}


$sp->close();
$conexion->close();
?>
