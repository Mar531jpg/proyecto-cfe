DELIMITER $$

DROP PROCEDURE IF EXISTS Guardar_Contrasena$$
CREATE PROCEDURE Guardar_Contrasena(
    IN pId INT,
    IN pContrasenaActual VARCHAR(255),
    IN pNuevaContrasena VARCHAR(255)
)
BEGIN
    DECLARE contrasenaExistente VARCHAR(255);

    SELECT Password INTO contrasenaExistente FROM Usuarios WHERE Id = pId;

    IF contrasenaExistente IS NULL OR contrasenaExistente = '' THEN
        -- No hay contraseña previa, se inserta directamente
        UPDATE Usuarios SET Password = pNuevaContrasena WHERE Id = pId;
        SELECT 1 AS Result, 'Contraseña registrada correctamente' AS Message;
    ELSE
        -- Verificar que la contraseña actual coincida
        IF contrasenaExistente = pContrasenaActual THEN
            UPDATE Usuarios SET Password = pNuevaContrasena WHERE Id = pId;
            SELECT 1 AS Result, 'Contraseña actualizada correctamente' AS Message;
        ELSE
            SELECT 0 AS Result, 'La contraseña actual no coincide' AS Message;
        END IF;
    END IF;
END $$
DELIMITER ;
