-- Tabela: jogadores
CREATE DATABASE IF NOT EXISTS bdtcc;
USE bdtcc;

CREATE TABLE IF NOT EXISTS jogadores (
    jogador_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

-- Tabela: perguntas
CREATE TABLE  IF NOT EXISTS perguntas (
    pergunta_id INT AUTO_INCREMENT PRIMARY KEY,
    texto_pergunta TEXT NOT NULL
);

-- Tabela: opcoes_resposta
CREATE TABLE IF NOT EXISTS opcoes_resposta (
    opcao_id INT AUTO_INCREMENT PRIMARY KEY,
    pergunta_id INT NOT NULL,
    texto_opcao TEXT NOT NULL,
    indice_opcao INT NOT NULL,
    FOREIGN KEY (pergunta_id) REFERENCES perguntas(pergunta_id) ON DELETE CASCADE
);

-- Tabela: respostas_certas
CREATE TABLE IF NOT EXISTS respostas_certas (
    pergunta_id INT PRIMARY KEY,
    indice_correto INT NOT NULL,
    FOREIGN KEY (pergunta_id) REFERENCES perguntas(pergunta_id) ON DELETE CASCADE
);

-- Tabela: rankings
CREATE TABLE IF NOT EXISTS rankings (
    ranking_id INT AUTO_INCREMENT PRIMARY KEY,
    jogador_id INT NOT NULL,
    pontuacao INT NOT NULL CHECK (pontuacao >= 0),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jogador_id) REFERENCES jogadores(jogador_id) ON DELETE CASCADE
);
