const Chat = require('../models/chat.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');
const { getAIResponse } = require('../utils/ai.utils');

exports.createChat = async (req, res) => {
  const chat = new Chat({ name: req.body.name, owner: req.body.userId });
  await chat.save();
  res.status(201).send(chat + "\n");
};

exports.renameChat = async (req, res) => {
  const chat = await Chat.findOneAndUpdate(
    { _id: req.params.id, owner: req.body.userId },
    { name: req.body.name },
    { new: true }
  );
  if (!chat) return res.status(404).send('Chat not found or you do not have permission');
  res.send(chat + "\n");
};

exports.deleteChat = async (req, res) => {
  const result = await Chat.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!result) return res.status(404).send('Chat not found or you do not have permission');
  res.status(204).send();
};

exports.sendMessage = async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, owner: req.userId });
  if (!chat) {
    return res.status(404).send('Chat not found or you do not have permission');
  }

  const user = await User.findById(req.userId);
  const userMessage = new Message({ user: user.username, message: req.body.message });
  await userMessage.save();
  chat.messages.push(userMessage);

  const aiResponse = await getAIResponse(req.body.message);
  const aiMessage = new Message({ user: 'ai', message: aiResponse });
  await aiMessage.save();
  chat.messages.push(aiMessage);

  await chat.save();

  res.status(201).send(JSON.stringify(chat, null, 2));
};

exports.getChats = async (req, res) => {
  const chats = await Chat.find({ owner: req.body.userId }, 'name');
  if (chats.length === 0) {
    res.send('No chats available\n');
  } else {
    const chatList = chats.map(chat => `Name: ${chat.name}, ID: ${chat._id}`).join('\n');
    res.send(chatList + "\n");
  }
};

exports.getMessages = async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, owner: req.userId }).populate('messages');
  if (!chat) {
    return res.status(404).send('Chat not found or you do not have permission');
  }

  const formattedMessages = chat.messages.map(message => {
    const istTime = new Date(message.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    return `${message.user} (${istTime}):\n${message.message}`;
  }).join('\n\n');

  res.send(formattedMessages + "\n");
};