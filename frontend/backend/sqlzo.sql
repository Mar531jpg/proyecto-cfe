

DELIMITER $$

DROP PROCEDURE IF EXISTS LoginUsuario$$
CREATE PROCEDURE LoginUsuario(
    IN pRPA VARCHAR(50),
    IN pPassword VARCHAR(255)
)
BEGIN
    login_block: BEGIN  

        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE RPA = pRPA) THEN
            SELECT 
            	0 AS Result, 
                'El correo o Nombre de usuario no está registrado' AS Message;
            LEAVE login_block;  
        END IF;

        

        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE RPA = pRPA AND Password = pPassword) THEN
            SELECT 
                0 AS Result, 
                'La contraseña es incorrecta' AS Message;
            LEAVE login_block;
        END IF;


        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE RPA = pRPA AND Password = pPassword AND Activo = 1) THEN
            SELECT 
            	0 AS Result, 
                'El usuario está inactivo' AS Message;
            LEAVE login_block;
        END IF;

        SELECT 
            1 AS Result,
            CONCAT('Bienvenido ', a.Nombre, ' ', a.ApellidoPaterno, ' ', a.ApellidoMaterno, '( ', c.Nombre, ' )') AS Message,
            a.Id,
            a.Nombre,
            a.ApellidoPaterno,
            a.ApellidoMaterno,
            c.Nombre AS Puesto
        FROM Usuarios a
        LEFT JOIN usuario_x_puesto b
            ON a.Id = b.Usuarios_Id
        LEFT JOIN Puestos c
            ON c.Id = b.Puestos_Id
        WHERE 
        	RPA = pRPA;

    END login_block;

END $$

DELIMITER ;