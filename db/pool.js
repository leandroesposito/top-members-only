const { Pool } = require("pg");
const connecton_config = require("./connection_config");

module.exports = new Pool(connecton_config);
