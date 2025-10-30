DROP PROCEDURE IF EXISTS ObtenerMotivos;
DELIMITER $$
CREATE PROCEDURE ObtenerMotivos(
    IN p_rpe VARCHAR(20)
)
BEGIN
    DECLARE v_NombrePuesto VARCHAR(100);

    SELECT c.Nombre
    INTO v_NombrePuesto
    FROM Usuarios a
    INNER JOIN usuariopuesto b ON a.Id = b.IdUsuario
    INNER JOIN Puestos c ON c.Id = b.IdPuesto
    WHERE a.RPE = p_rpe
    LIMIT 1;

    -- Si el puesto es uno de los restringidos, mostrar solo el motivo con Id = 3
    IF v_NombrePuesto IN ('SUPERINTENDENTE', 'JEFE DE DEPARTAMENTO', 'JEFE DE OFICINA') THEN
        SELECT 
            Id, 
            Nombre
        FROM 
            Motivos_Extra
        WHERE 
            Id = 3
        ORDER BY 
            Nombre ASC;
    ELSE
        -- Si no, mostrar todos los demás 
        SELECT 
            Id, 
            Nombre
        FROM 
            Motivos_Extra
        ORDER BY 
            Nombre ASC;
    END IF;
END $$
DELIMITER ;


/*
INSERT INTO Motivos_Extra(Nombre)
VALUES('Tiempo extra'),('Viáticos')

*/


