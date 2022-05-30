/* eslint-disable class-methods-use-this */
const { dbQuery } = require('./db-query');

module.exports = class PgPersistence {
  async getAllTodos() {
    const GET_ALL = 'SELECT * FROM todos';

    const result = await dbQuery(GET_ALL);
    return result.rows;
  }

  async addTodo(values) {
    const ADD_TODO = 'INSERT INTO todos (title, day, month, year, description) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    await dbQuery(ADD_TODO, values);
  }

  async deleteTodo(id) {
    const DELETE_TODO = 'DELETE FROM todos WHERE id = $1';
    await dbQuery(DELETE_TODO, [id]);
  }

  async updateTodo(values, id) {
    const UPDATE_TODO = `UPDATE todos SET title = $1, day = $2, month = $3, year = $4, description = $5 WHERE id = ${id}`;
    const result = await dbQuery(UPDATE_TODO, values);
    return result.rows;
  }

  async updateComplete(values, id) {
    const UPDATE_COMPLETE = `UPDATE todos SET completed = $1 WHERE id = ${id}`;
    const results = await dbQuery(UPDATE_COMPLETE, values);
    return results.rows;
  }
};
