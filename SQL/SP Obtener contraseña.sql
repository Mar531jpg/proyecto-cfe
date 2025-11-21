DELIMITER $$


DROP PROCEDURE IF EXISTS Obtener_Contrasena$$
CREATE PROCEDURE Obtener_Contrasena(IN pId INT)
BEGIN
    SELECT IFNULL(Password, '') AS Contrasena
    FROM Usuarios
    WHERE Id = pId;
END $$
DELIMITER ;

