<?php
header('Content-Type: application/json');
require_once 'config.php';

$conexion = new mysqli($DB_SERVIDOR,$DB_USUARIO,$DB_CLAVE,$DB_NOMBRE,$DB_PUERTO);
if($conexion->connect_error){
    echo json_encode(['Result'=>0,'Message'=>'Error de conexión']);
    exit;
}

$sp = $conexion->prepare("CALL Obtener_Puestos()");
if(!$sp->execute()){
    echo json_encode(['Result'=>0,'Message'=>'Error al ejecutar el SP']);
    exit;
}

$result = $sp->get_result();
$puestos = [];
while($fila = $result->fetch_assoc()){
    $puestos[] = $fila;
}

echo json_encode(['Result'=>1,'Puestos'=>$puestos]);

$sp->close();
$conexion->close();
?>
