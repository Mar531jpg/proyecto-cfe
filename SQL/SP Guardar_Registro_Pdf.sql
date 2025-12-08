DELIMITER $$

DROP PROCEDURE IF EXISTS GuardarRegistroPDF$$
CREATE PROCEDURE GuardarRegistroPDF(
    IN pNombre VARCHAR(100),
    IN pApellidoPaterno VARCHAR(100),
    IN pApellidoMaterno VARCHAR(100),
    IN pTotalDesayuno INT,
    IN pTotalComida INT,
    IN pTotalCena INT
)
BEGIN
    DECLARE vIdUsuario INT;

    SELECT Id INTO vIdUsuario
    FROM Usuarios
    WHERE Nombre = pNombre
      AND ApellidoPaterno = pApellidoPaterno
      AND ApellidoMaterno = pApellidoMaterno
    LIMIT 1;

    IF vIdUsuario IS NULL THEN
        SELECT 0 AS Result, 'Usuario no encontrado' AS Message;
    ELSE
        INSERT INTO ReportesGenerados (IdUsuario, TotalDesayunos, TotalComidas, TotalCena, RowCreated_At)
        VALUES (vIdUsuario, pTotalDesayuno, pTotalComida, pTotalCena, NOW());

        SELECT 1 AS Result, 'Reporte guardado correctamente' AS Message;
    END IF;

END$$

DELIMITER ;
