DELIMITER $$

DROP PROCEDURE IF EXISTS ObtenerTotalesHoy$$
CREATE PROCEDURE ObtenerTotalesHoy(
    IN pIdUsuario INT,
    IN pFechaInicio DATE,
    IN pFechaFin DATE
)
BEGIN
    SELECT 
        u.Id AS IdUsuario,
        CONCAT(u.Nombre, ' ', u.ApellidoPaterno, ' ', u.ApellidoMaterno) AS NombreCompleto,
        IFNULL(u.RPE, ' ') AS RPE,
        IFNULL(p.Nombre, '') AS Puesto,
        IFNULL(cp.Nombre, '') AS TipoPuesto,
        IFNULL(cp.Id, 0) AS IdTipoPuesto,
        SUM(r.TotalDesayunos) AS TotalDesayunos,
        SUM(r.TotalComidas) AS TotalComidas,
        SUM(r.TotalCena) AS TotalCena
    FROM Usuarios u
    LEFT JOIN UsuarioPuesto up
        ON u.Id = up.IdUsuario
    LEFT JOIN Puestos p
        ON up.IdPuesto = p.Id
    LEFT JOIN Catalogo_puestos cp
        ON p.Catalogo_Puestos_Id = cp.Id
    INNER JOIN ReportesGenerados r
        ON u.Id = r.IdUsuario
       AND (
           (pFechaInicio IS NULL OR pFechaFin IS NULL AND DATE(r.RowCreated_At) = CURDATE())
           OR
           (pFechaInicio IS NOT NULL AND pFechaFin IS NOT NULL AND DATE(r.RowCreated_At) BETWEEN pFechaInicio AND pFechaFin)
       )
    WHERE (pIdUsuario = 0 OR u.Id = pIdUsuario)
    GROUP BY u.Id, u.Nombre, u.ApellidoPaterno, u.ApellidoMaterno, p.Nombre, cp.Nombre, cp.Id;
END$$

DELIMITER ;
