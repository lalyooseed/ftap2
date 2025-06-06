// server-and-bot.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('Клиент подключился');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Discord бот
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;

  io.emit('newMessage', {
    author: message.author.tag,
    content: message.content,
    channel: message.channel.name,
    timestamp: message.createdTimestamp,
  });
});

client.login(process.env.TOKEN);
