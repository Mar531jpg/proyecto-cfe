

CREATE TABLE ReportesGenerados(
	Id INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT,
    TotalDesayunos INT,
    TotalComidas INT,
    TotalCena INT,
    RowCreated_At DATETIME
)