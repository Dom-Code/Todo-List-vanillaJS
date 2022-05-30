const { Client } = require('pg');

module.exports = {
  async dbQuery(statement, values) {
    const client = new Client({ database: 'todo-list' });
    await client.connect();
    try {
      const result = await client.query(statement, values);
      return result;
    } catch (err) {
      console.log(err.stack);
    }
    await client.end();
  },
};
