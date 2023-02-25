/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
const { Client } = require('pg');
const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '../.env') });

const user = 'postgres';
const host = 'localhost';
const database = 'Sdc';
const password = 'postpass';
const port = 5432;

const db = new Client({
  user,
  host,
  database,
  password,
  port,
});

module.exports = db;
