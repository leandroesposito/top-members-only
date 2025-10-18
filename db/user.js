const { runGetquery, runQuery } = require("./queries");

async function insertUser(user) {
  const { first_name, last_name, username, password, is_member, is_admin } =
    user;
  const query = `
    INSERT INTO users (
        first_name, last_name, username, password, is_member, is_admin
      )
      VALUES ( $1, $2, $3, $4, $5, $6 )
      RETURNING id;
  `;
  const params = [
    first_name,
    last_name,
    username,
    password,
    is_member,
    is_admin,
  ];

  const rows = await runGetquery(query, params);
  return rows[0].id;
}

async function getUserById(id) {
  const query = `SELECT * FROM users WHERE id = $1;`;
  const params = [id];

  const rows = await runGetquery(query, params);
  return rows;
}

async function getAllUsers() {
  const query = `SELECT * FROM users;`;

  const rows = await runGetquery(query);
  return rows;
}

async function getUserByUsername(username) {
  const query = `SELECT * FROM users WHERE username = $1`;
  const params = [username];

  const rows = await runGetquery(query, params);
  return rows[0];
}

async function updateUser(user) {
  const { first_name, last_name, username, password, is_member, is_admin, id } =
    user;
  const query = `
    UPDATE users
      SET
        first_name = $1,
        last_name = $2,
        username = $3,
        password = $4,
        is_member = $5,
        is_admin = $6
      WHERE id = $7;
  `;
  const params = [
    first_name,
    last_name,
    username,
    password,
    is_member,
    is_admin,
    id,
  ];

  await runQuery(query, params);
}

async function deleteUser(user) {
  let id;

  switch (typeof user) {
    case "object":
      id = user.id;
      break;
    case "number":
      id = user;
      break;
    default:
      throw new Error("Invalid parameter type");
  }

  const query = `
    DELETE FROM users
      WHERE id = $1;
  `;
  const params = [id];

  await runQuery(query, params);
}

module.exports = {
  insertUser,
  getUserById,
  getAllUsers,
  getUserByUsername,
  updateUser,
  deleteUser,
};
