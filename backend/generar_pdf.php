<?php
require(__DIR__ . '/fpdf186/fpdf.php');

$data = json_decode(file_get_contents('php://input'), true);

$trabajador = $data['trabajador'] ?? '';
$horas = $data['horas'] ?? 0;
$fecha = $data['fecha'] ?? '';

$pdf = new FPDF('P','mm','LETTER');
$pdf->AddPage();

$imagen_fondo = __DIR__ . '/../frontend/Images/formato_cfe.png';

if (!file_exists($imagen_fondo)) {
    header('Content-Type: application/json');
    echo json_encode(['error' => "No se encontró la imagen en $imagen_fondo"]);
    exit;
}

$pdf->Image($imagen_fondo, 0, 0, $pdf->GetPageWidth(), $pdf->GetPageHeight());

$pdf->SetFont('Arial','',18);

$pdf->SetXY(15, 27);
$pdf->Cell(0,10, utf8_decode($fecha) );

$pdf->SetXY(15, 45);
$pdf->Cell(0,10, utf8_decode($trabajador) );

$pdf->SetXY(15, 78);
$pdf->Cell(0,10, utf8_decode($horas) );


if (ob_get_length()) {
    ob_end_clean();
}

header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="FormatoCFE.pdf"');

$pdf->Output('D', 'FormatoCFE.pdf');
exit;