const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');
const app = require('./index.js');

test('GET /tarefas retorna 200 e uma lista vazia', async (t) => {
  const servidor = app.listen(0, '127.0.0.1');
  await once(servidor, 'listening');
  t.after(() => new Promise((resolve) => servidor.close(resolve)));

  const { port } = servidor.address();
  const resposta = await fetch(`http://127.0.0.1:${port}/tarefas`);

  assert.equal(resposta.status, 200);
  assert.deepEqual(await resposta.json(), []);
});
test('POST /tarefas cria uma tarefa com status pendente', async (t) => {
  const servidor = app.listen(0, '127.0.0.1');
  await once(servidor, 'listening');
  t.after(() => new Promise((resolve) => servidor.close(resolve)));

  const { port } = servidor.address();
  const resposta = await fetch(`http://127.0.0.1:${port}/tarefas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: 'Preparar seminário' }),
  });

  assert.equal(resposta.status, 201);

  const tarefa = await resposta.json();
  assert.equal(typeof tarefa.id, 'number');
  assert.equal(tarefa.titulo, 'Preparar seminário');
  assert.equal(tarefa.status, 'pendente');
});

test('PATCH /tarefas/:id marca a tarefa como concluída', async (t) => {
  const servidor = app.listen(0, '127.0.0.1');
  await once(servidor, 'listening');
  t.after(() => new Promise((resolve) => servidor.close(resolve)));

  const { port } = servidor.address();
  const url = `http://127.0.0.1:${port}/tarefas`;

  const cadastro = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo: 'Revisar o artigo' }),
  });

  assert.equal(cadastro.status, 201);
  const tarefa = await cadastro.json();

  const resposta = await fetch(`${url}/${tarefa.id}`, {
    method: 'PATCH',
  });

  assert.equal(resposta.status, 200);
  const atualizada = await resposta.json();
  assert.equal(atualizada.id, tarefa.id);
  assert.equal(atualizada.status, 'concluída');
});