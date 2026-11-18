const express = require('express');

const app = express();
const tarefas = [];
app.use(express.json());

app.get('/tarefas', (req, res) => {
  res.json(tarefas);
});

app.post('/tarefas', (req, res) => {
  const titulo = req.body?.titulo;

  if (typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ erro: 'Informe o título da tarefa.' });
  }

  const tarefa = {
    id: tarefas.length + 1,
    titulo: titulo.trim(),
    status: 'pendente',
  };

  tarefas.push(tarefa);
  res.status(201).json(tarefa);
});

app.patch('/tarefas/:id', (req, res) => {
  const tarefa = tarefas.find((item) => String(item.id) === req.params.id);

  if (!tarefa) {
    return res.status(404).json({ erro: 'Tarefa não encontrada.' });
  }

  tarefa.status = 'concluída';
  res.json(tarefa);
});

if (require.main === module) {
  app.listen(3000, '127.0.0.1', () => {
    console.log('API rodando em http://127.0.0.1:3000');
  });
}

module.exports = app;