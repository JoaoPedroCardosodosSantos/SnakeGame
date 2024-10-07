CREATE DATABASE JogoCobrinha CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE JogoCobrinha;

CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    User VARCHAR(20) NOT NULL,
    Score INT NOT NULL
);

-- Exemplo de ordenação de tabela

SELECT * FROM Users;

SELECT * FROM Users ORDER BY Score DESC;  -- Isso devera retornar todas as culunas de Users e irá ordenar as linhas em ordem decrescente usando Score como referencia