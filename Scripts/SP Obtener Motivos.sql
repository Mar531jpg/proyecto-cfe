DELIMITER $$

DROP PROCEDURE IF EXISTS ObtenerMotivos$$
CREATE PROCEDURE ObtenerMotivos()
BEGIN
    SELECT 
        Id, 
        Nombre
    FROM 
        Motivos_Extra
    ORDER BY 
        Nombre ASC;
END $$

DELIMITER ;

/*
INSERT INTO Motivos_Extra(Nombre)
VALUES('Tiempo extra.'),('Viáticos')

*/


