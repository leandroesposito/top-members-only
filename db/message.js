const pool = require("./pool");
const { runGetquery, runQuery } = require("./queries");

async function insertMessage(message) {
  const { user_id, title, timestamp, text } = message;
  const query = `
    INSERT INTO messages (
      user_id, title, timestamp, text
    ) VALUES (
      $1, $2, $3, $4
    ) RETURNING id;
  `;
  const params = [user_id, title, timestamp, text];

  const rows = await runGetquery(query, params);
  return rows[0].id;
}

async function getMessageById(id) {
  const query = `SELECT * FROM messages WHERE id = $1`;
  const params = [id];

  const rows = await runGetquery(query, params);
  return rows;
}

async function getAllMessages() {
  const query = `SELECT * FROM messages`;

  const rows = await runGetquery(query);
  return rows;
}

async function updateMessage(message) {
  const { id, user_id, title, timestamp, text } = message;
  const query = `
    UPDATE
      messages SET
        user_id = $1,
        title = $2,
        timestamp = $3,
        text = $4,
      WHERE id = $5
  `;
  const params = [user_id, title, timestamp, text, id];

  await runQuery(query, params);
}

async function deleteMessage(message) {
  let id;

  switch (typeof message) {
    case "object":
      id = message.id;
      break;
    case "number":
      id = message;
      break;
    default:
      throw new Error("Invalid parameter type");
  }

  const query = `DELETE FROM messages WERE id = $1`;
  const params = [id];

  await runQuery(query, params);
}

module.exports = {
  insertMessage,
  getMessageById,
  getAllMessages,
  updateMessage,
  deleteMessage,
};
