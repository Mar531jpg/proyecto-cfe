DELIMITER $$

DROP PROCEDURE IF EXISTS LoginUsuario$$
CREATE PROCEDURE LoginUsuario(
    IN pRPE VARCHAR(50),
    IN pPassword VARCHAR(255)
)
BEGIN
    login_block: BEGIN  

        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE RPE = pRPE) THEN
            SELECT 
                0 AS Resultado, 
                'El RPE no está registrado' AS Mensaje;
            LEAVE login_block;  
        END IF;

        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE RPE = pRPE AND Password = pPassword) THEN
            SELECT 
                0 AS Resultado, 
                'La contraseña es incorrecta' AS Mensaje;
            LEAVE login_block;
        END IF;

        -- Validar si está activo
        IF NOT EXISTS (SELECT 1 FROM Usuarios WHERE RPE = pRPE AND Password = pPassword AND Activo = 1) THEN
            SELECT 
                0 AS Resultado, 
                'El usuario está inactivo' AS Mensaje;
            LEAVE login_block;
        END IF;

        SELECT 
			a.Id,
			1 AS Resultado,
			CONCAT(
				'Bienvenido ',
				IFNULL(a.Nombre, ''),
				' ',
				IFNULL(a.ApellidoPaterno, ''),
				' ',
				IFNULL(a.ApellidoMaterno, ''),
				' (',
				IFNULL(c.Nombre, ''),
				')'
			) AS Mensaje,
			a.Id,
			IFNULL(a.Nombre, '') AS Nombre,
			IFNULL(a.ApellidoPaterno, '') AS ApellidoPaterno,
			IFNULL(a.ApellidoMaterno, '') AS ApellidoMaterno,
			IFNULL(a.RPE, '') AS RPE,
			IFNULL(c.Nombre, '') AS Puesto,
			IFNULL(e.Nombre, 'Usuario') AS Rol,
            IFNULL(f.Nombre, 'Sindicalizado') AS Catalogo_Puestos
		FROM Usuarios a
		LEFT JOIN UsuarioPuesto b 
			ON a.Id = b.IdUsuario
		LEFT JOIN Puestos c 
			ON c.Id = b.IdPuesto
		LEFT JOIN usuario_roles d
			ON a.Id = d.Usuarios_Id
		LEFT JOIN Roles e
			ON e.Id = d.Roles_Id
		LEFT JOIN Catalogo_puestos f
			ON c.Catalogo_Puestos_Id = f.Id
		WHERE a.RPE = pRPE
        ORDER BY a.Id ;

    END login_block;

END $$

DELIMITER ;
