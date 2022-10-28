const mongoose = require('mongoose');

const {DB_PORT, APP_NAME} = require('./env');

const connectionString = `mongodb://localhost:${DB_PORT}/${APP_NAME}`;

exports.initializeDatabase = () => mongoose.connect(connectionString);