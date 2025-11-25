DELIMITER $$

DROP PROCEDURE IF EXISTS GuardarUsuario$$
CREATE PROCEDURE GuardarUsuario(
    IN pAccion VARCHAR(10),
    IN pId INT,
    IN pNombre VARCHAR(100),
    IN pApellidoPaterno VARCHAR(100),
    IN pApellidoMaterno VARCHAR(100),
    IN pRPE VARCHAR(50),
    IN pActivo TINYINT,
    IN pIdPuesto INT
)
BEGIN
    IF pAccion = 'Editar' THEN
        -- Actualizar usuario existente
        UPDATE Usuarios
        SET 
            Nombre = pNombre,
            ApellidoPaterno = pApellidoPaterno,
            ApellidoMaterno = pApellidoMaterno,
            RPE = pRPE,
            Activo = pActivo
        WHERE Id = pId;
        
        -- Actualizar o insertar puesto en UsuarioPuesto
        IF EXISTS (SELECT 1 FROM UsuarioPuesto WHERE IdUsuario = pId) THEN
            UPDATE UsuarioPuesto
            SET IdPuesto = pIdPuesto
            WHERE IdUsuario = pId;
        ELSE
            INSERT INTO UsuarioPuesto (IdUsuario, IdPuesto)
            VALUES (pId, pIdPuesto);
        END IF;

        SELECT 1 AS Result, 'Usuario actualizado correctamente' AS Message;

    ELSEIF pAccion = 'Nuevo' THEN
        -- Insertar nuevo usuario
        INSERT INTO Usuarios (Nombre, ApellidoPaterno, ApellidoMaterno, RPE, Activo)
        VALUES (pNombre, pApellidoPaterno, pApellidoMaterno, pRPE, pActivo);

        -- Obtener el Id generado
        SET @nuevoId = LAST_INSERT_ID();

        -- Insertar puesto
        INSERT INTO UsuarioPuesto (IdUsuario, IdPuesto)
        VALUES (@nuevoId, pIdPuesto);

        SELECT 1 AS Result, 'Usuario agregado correctamente' AS Message;
    ELSE
        SELECT 0 AS Result, 'Acción inválida' AS Message;
    END IF;
END$$

DELIMITER ;
