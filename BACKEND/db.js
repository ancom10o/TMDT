const { Pool } = require("pg");

const pool = new Pool({
  user: "noel_user",
  host: "localhost",
  database: "noel_shop",
  password: "123456",
  port: 5432,
});

module.exports = pool;