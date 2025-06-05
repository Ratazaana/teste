const express = require('express');
const app = express();
const PORT = 3000;
const connection = require('./bd'); // importa a conexão com o MySQL
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROTA DE LOGIN
app.post('/login', (req, res) => {
  const { user, senha } = req.body;

  const query = 'SELECT * FROM jogadores WHERE nome = ? AND senha = ?';
  connection.query(query, [user, senha], (err, results) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(500).json({ success: false, message: 'Erro no servidor.' });
    }

    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Usuário ou senha incorretos.' });
    }
  });
});

app.post('/cadastro', (req, res) => {
  const { user, senha } = req.body;

  if (!user || !senha) {
    return res.status(400).json({ success: false, message: 'Usuário e senha são obrigatórios.' });
  }

  const query = 'INSERT INTO jogadores (nome, senha) VALUES (?, ?)';
  connection.query(query, [user, senha], (err, result) => {
    if (err) {
      console.error('Erro ao inserir usuário:', err);
      return res.status(500).json({ success: false, message: 'Erro ao cadastrar usuário.' });
    }

    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});