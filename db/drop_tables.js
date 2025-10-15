const connection_config = require("./connection_config");
const { Client } = require("pg");

const SQL_DROP = `
  DROP TABLE IF EXISTS messages;

  DROP TABLE IF EXISTS users;
`;

async function main() {
  console.log("Initializing drop tables process...");
  const client = new Client(connection_config);
  console.log("Connecting to database...");
  await client.connect();
  console.log("Dropping tables...");
  await client.query(SQL_DROP);
  await client.end();
  console.log("Done!");
}

if (require.main === module) {
  main();
}

module.exports = { SQL_DROP };
