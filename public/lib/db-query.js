const { Client } = require('pg');
const config = require('./config');

const isProduction = (config.NODE_ENV === 'production');
const CONNECTION = {
  connectionString: config.DATABASE_URL,
  ssl: isProduction,
  // ssl: { rejectUnauthorized: false },
};

module.exports = {
  async dbQuery(statement, values) {
    // const client = new Client({ database:heroku 'todo-list' });
    const client = new Client(CONNECTION);
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
