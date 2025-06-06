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

app.post('/quiz', (req, res) => {
  const { perguntas } = req.body;
  if (!Array.isArray(perguntas) || perguntas.length !== 10) {
    return res.status(400).json({ success: false, message: 'Envie exatamente 10 perguntas.' });
  }

  const salvarPerguntas = async () => {
    const db = connection.promise(); // usa versão com Promises
    try {
      for (const p of perguntas) {
        const [perguntaResult] = await db.query(
        'INSERT INTO perguntas (texto_pergunta) VALUES (?)',
        [p.pergunta]
        );
        const perguntaId = perguntaResult.insertId;
        const alternativas = [
        p.alternativa_a,
        p.alternativa_b,
        p.alternativa_c,
        p.alternativa_d
        ];
        for (let i = 0; i < alternativas.length; i++) {
          await db.query(
          'INSERT INTO opcoes_resposta (pergunta_id, texto_opcao, indice_opcao) VALUES (?, ?, ?)',
          [perguntaId, alternativas[i], i]
          );
        }
        const mapaIndice = { A: 0, B: 1, C: 2, D: 3 };
        const indiceCorreto = mapaIndice[p.correta.toUpperCase()];
        await db.query(
        'INSERT INTO respostas_certas (pergunta_id, indice_correto) VALUES (?, ?)',
        [perguntaId, indiceCorreto]
        );
      }
      res.json({ success: true });
    } catch (err) {
      console.error('Erro ao salvar perguntas:', err);
      res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
    }
  };
  salvarPerguntas();
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});