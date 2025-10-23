const { Client } = require("pg");
const connection_config = require("./connection_config");
const bcrypt = require("bcryptjs");
const { SQL_DROP } = require("./drop_tables");
const { SQL_CREATE } = require("./create_tables");
require("dotenv").config();

const users = [
  {
    id: 1,
    first_name: "Alice",
    last_name: "Johnson",
    username: "alice.j",
    password: process.env.ADMIN_PASSWORD,
    is_member: true,
    is_admin: false,
  },
  {
    id: 2,
    first_name: "Bob",
    last_name: "Smith",
    username: "bob.s",
    password: process.env.ADMIN_PASSWORD,
    is_member: true,
    is_admin: true,
  },
  {
    id: 3,
    first_name: "Charlie",
    last_name: "Brown",
    username: "charlie.b",
    password: process.env.ADMIN_PASSWORD,
    is_member: false,
    is_admin: false,
  },
  {
    id: 4,
    first_name: "Dana",
    last_name: "White",
    username: "dana.w",
    password: process.env.ADMIN_PASSWORD,
    is_member: true,
    is_admin: true,
  },
  {
    id: 5,
    first_name: "Eva",
    last_name: "Green",
    username: "eva.g",
    password: process.env.ADMIN_PASSWORD,
    is_member: false,
    is_admin: false,
  },
  {
    first_name: "admin",
    last_name: "admin",
    username: "admin",
    password: process.env.ADMIN_PASSWORD,
    is_member: false,
    is_admin: true,
  },
  {
    first_name: "member",
    last_name: "member",
    username: "member",
    password: "member",
    is_member: true,
    is_admin: false,
  },
  {
    first_name: "user",
    last_name: "user",
    username: "user",
    password: "user",
    is_member: false,
    is_admin: false,
  },
  {
    first_name: "god",
    last_name: "god",
    username: "god",
    password: process.env.ADMIN_PASSWORD,
    is_member: true,
    is_admin: true,
  },
];

const messages = [
  {
    id: 1,
    user_id: 1,
    title: "Welcome Message",
    timestamp: "2025-10-15 08:30:00",
    text: "Hello everyone! Welcome to our platform.",
  },
  {
    id: 2,
    user_id: 2,
    title: "Admin Announcement",
    timestamp: "2025-10-15 09:00:00",
    text: "Don't forget to check out the new features we just released!",
  },
  {
    id: 3,
    user_id: 3,
    title: "Question about Features",
    timestamp: "2025-10-15 10:15:00",
    text: "Can someone explain how the new tagging feature works?",
  },
  {
    id: 4,
    user_id: 4,
    title: "Feedback Request",
    timestamp: "2025-10-15 11:00:00",
    text: "We would love to hear your thoughts about our latest update.",
  },
  {
    id: 5,
    user_id: 5,
    title: "Help Needed",
    timestamp: "2025-10-15 12:30:00",
    text: "I am having trouble logging in. Can anyone help?",
  },
];

async function insertUser(client, user) {
  const passwordHash = await bcrypt.hash(user.password, 10);
  await client.query(
    `
    INSERT INTO users (
        first_name, last_name, username, password, is_member, is_admin
      )
      VALUES (
        $1, $2, $3, $4, $5, $6
      );
    `,
    [
      user.first_name,
      user.last_name,
      user.username,
      passwordHash,
      user.is_member,
      user.is_admin,
    ]
  );
}

async function insertMessage(client, message) {
  await client.query(
    `
      INSERT INTO messages (
          user_id, title, timestamp, text
        )
        VALUES (
          $1, $2, $3, $4
        )
    `,
    [message.user_id, message.title, message.timestamp, message.text]
  );
}

async function main() {
  console.log("Starting process...");
  const client = new Client(connection_config);
  console.log("Connecting to database...");
  await client.connect();
  console.log("Clearing database...");
  await client.query(SQL_DROP);
  console.log("Creating tables...");
  await client.query(SQL_CREATE);
  console.log("Inserting users...");
  for (const user of users) {
    await insertUser(client, user);
  }
  console.log("Inserting messages...");
  for (const message of messages) {
    await insertMessage(client, message);
  }
  client.end();
  console.log("Done");
}

if (require.main === module) {
  main();
}
