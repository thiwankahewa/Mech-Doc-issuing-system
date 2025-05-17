const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "1234", // replace with your actual password
  database: "letterheaddb", // replace with your DB name
});

module.exports = db;
