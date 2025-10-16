const pool = require("./pool");

async function runGetquery(query, params = []) {
  try {
    const { rows } = await pool.query(query, params);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function runQuery(query, params = []) {
  try {
    await pool.query(query, params);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  runGetquery,
  runQuery,
};
