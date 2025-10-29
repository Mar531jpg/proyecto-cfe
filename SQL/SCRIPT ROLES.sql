CREATE TABLE Roles(
	Id INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(50)
);

INSERT INTO Roles(Nombre)
VALUES('Admin'), ('Usuario');

CREATE TABLE usuario_roles(
	Id INT AUTO_INCREMENT PRIMARY KEY,
    Usuarios_Id INT,
    Roles_Id INT
);

INSERT INTO usuario_roles(Usuarios_Id, Roles_Id)
VALUES (52, 1)

