CREATE TABLE Catalogo_Puestos(
	Id INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(50)
);

INSERT INTO Catalogo_Puestos(Nombre)
VALUES ('Confianza'), ('Sindicalizado');

SELECT 
	Nombre, ApellidoPaterno, ApellidoMaterno, RPE, Password, Activo
FROM Usuarios;

SELECT * FROM Usuarios;

SELECT IdUsuario, IdPuesto FROM usuariopuesto;

SELECT 
	a.Nombre,
    b.Nombre AS Tipo
FROM Puestos a
LEFT JOIN Catalogo_Puestos b
	ON a.Catalogo_Puestos_Id = b.Id;
    
SELECT * FROM Puestos;


ALTER TABLE Puestos
ADD column Catalogo_Puestos_Id INT;
