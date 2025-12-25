require('dotenv').config();
const express = require('express');

const app = express();

app.use(express.json());

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/book', require('./routes/book.routes'));

module.exports = app;