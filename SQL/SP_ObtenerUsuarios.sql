DROP PROCEDURE IF EXISTS ObtenerUsuarios;
DELIMITER $$

CREATE PROCEDURE ObtenerUsuarios()
BEGIN
    SELECT 
        Id,
        Nombre, 
        ApellidoPaterno, 
        ApellidoMaterno, 
        RPE, 
        Password, 
        Activo
    FROM Usuarios
    ORDER BY Id DESC;
END $$

DELIMITER ;
