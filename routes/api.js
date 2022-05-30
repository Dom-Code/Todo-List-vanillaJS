const express = require('express');

const router = express.Router();
// const fs = require('fs');
// const path = require('path');
const PgPersistence = require('../public/lib/pg-persistence');

router.use((req, res, next) => {
  res.locals.store = new PgPersistence(req.session);
  next();
});

router.get('/todos', async (req, res) => {
  const allTodos = await res.locals.store.getAllTodos();
  res.json(allTodos);
});

router.post('/todos', async (req, res) => {
  const values = Object.values(req.body);
  await res.locals.store.addTodo(values);
  res.sendStatus(204);
});

router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;
  await res.locals.store.deleteTodo(id);
  res.sendStatus(204);
});

router.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const values = Object.values(req.body);
  if (values.length > 1) {
    await res.locals.store.updateTodo(values, id);
    res.sendStatus(204);
  } else {
    await res.locals.store.updateComplete(values, id);
    res.sendStatus(204);
  }
});

module.exports = router;
