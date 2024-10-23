const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express()
const corsOptions = {
  origin: 'http://localhost:5500',
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/chats', chatRoutes);

app.get('/', (req, res) => {
  res.send("Use /chats or /chats/:chatid/messages to read\n");
});

module.exports = app;