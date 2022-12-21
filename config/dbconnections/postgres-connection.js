const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  host: process.env.HOST_POSTGRES,
  user: process.env.USER_POSTGRES,
  password: process.env.PASSWORD_POSTGRES,
  database: process.env.DATABASE_POSTGRES,
  port: process.env.PORT_POSTGRES
});

pool.connect(function (e) {
  if (e) throw e;
  console.log("conectou")
})
module.exports = {
  query: (text, params) => pool.query(text, params),
};