DROP PROCEDURE IF EXISTS ObtenerMotivos;
DELIMITER $$
CREATE PROCEDURE ObtenerMotivos(
    IN p_rpe VARCHAR(20)
)
BEGIN
    DECLARE Catalogo_Puestos_Id INT;

    SELECT 
		c.Catalogo_Puestos_Id
    INTO Catalogo_Puestos_Id
    FROM Usuarios a
    INNER JOIN usuariopuesto b 
		ON a.Id = b.IdUsuario
    INNER JOIN Puestos c 
		ON c.Id = b.IdPuesto
    WHERE 
		a.RPE = p_rpe
    LIMIT 1;

    -- Si el puesto es uno de los restringidos, mostrar solo el motivo con Id = 3
    IF Catalogo_Puestos_Id = 1 THEN
        SELECT 
            Id, 
            Nombre
        FROM 
            Motivos_Extra
        WHERE 
            Id = 3
        ORDER BY 
              Id ASC;
    ELSE
        -- Si no, mostrar todos los demás 
        SELECT 
            Id, 
            Nombre
        FROM 
            Motivos_Extra
		WHERE
			Id != 3
        ORDER BY 
            Id ASC;
    END IF;
END $$
DELIMITER ;


/*
INSERT INTO Motivos_Extra(Nombre)
VALUES('Tiempo extra'),('Viáticos')

*/


