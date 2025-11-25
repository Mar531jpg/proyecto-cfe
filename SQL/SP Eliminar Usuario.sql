DELIMITER $$

DROP PROCEDURE IF EXISTS EliminarUsuario$$
CREATE PROCEDURE EliminarUsuario(
    IN pId INT
)
BEGIN
    DECLARE vExiste INT;

    -- Verificar si existe el usuario
    SELECT COUNT(*) INTO vExiste FROM Usuarios WHERE Id = pId;

    IF vExiste = 0 THEN
        SELECT 0 AS Result, 'El usuario no existe' AS Message;
    ELSE
        DELETE FROM Usuarios WHERE Id = pId;
        SELECT 1 AS Result, 'Usuario eliminado correctamente' AS Message;
    END IF;
END$$

DELIMITER ;
