const connection_config = require("./connection_config");
const { Client } = require("pg");

const SQL_CREATE = `
  CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR ( 50 ),
    last_name VARCHAR ( 50 ),
    username VARCHAR ( 50 ),
    password VARCHAR ( 60 ),
    is_member BOOLEAN,
    is_admin BOOLEAN
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INT REFERENCES users ( id ) ON DELETE CASCADE,
    title VARCHAR ( 100 ),
    timestamp TIMESTAMP,
    text TEXT
  );
`;

async function main() {
  console.log("Initializing creation tables process...");
  const client = new Client(connection_config);
  console.log("Connecting to database...");
  await client.connect();
  console.log("Creating tables...");
  await client.query(SQL_CREATE);
  await client.end();
  console.log("Done!");
}

if (require.main === module) {
  main();
}

module.exports = { SQL_CREATE };
