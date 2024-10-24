const axios = require('axios');
const showdown = require('showdown');

const converter = new showdown.Converter();

const Chat = require('../models/chat.model');
const Message = require('../models/message.model');
const User = require('../models/user.model');
exports.createChat = async (req, res) => {
    try {
        const chat = new Chat({
            name: req.body.name,
            owner: req.userId, // Use req.userId from the verified token
            topic: req.body.topic
        });
        await chat.save();
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).send({ message: 'Error creating chat', error: error.message });
    }
};

exports.renameChat = async (req, res) => {
    try {
        const chat = await Chat.findOneAndUpdate(
            { _id: req.params.id, owner: req.userId }, // Use req.userId from the verified token
            { name: req.body.name },
            { new: true }
        );
        if (!chat) {
            return res.status(404).send({ message: 'Chat not found or user not authorized' });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).send({ message: 'Error renaming chat', error: error.message });
    }
};
exports.deleteChat = async (req, res) => {
    const result = await Chat.findOneAndDelete({ _id: req.params.id, owner: req.userId });
    if (!result) return res.status(404).send('Chat not found or you do not have permission');
    res.status(204).send();
};

exports.sendMessage = async (req, res) => {
    try{
    const chat = await Chat.findOne({ _id: req.params.id, owner: req.query.userId });
    if (!chat) {
        return res.status(404).send('Chat not found or you do not have permission');
    }

    const user = await User.findById(req.userId);
    const userMessage = new Message({ user: user.username, message: req.body.message });
    await userMessage.save();
    chat.messages.push(userMessage);

    // Prepare the history of the last 10 messages
    let history = [];
    if(chat.messages.length > 10) {
        history = chat.messages.slice(-10).map(msg => {
            return msg.user === 'assistant' ? { "assistant": msg.message } : { "human": msg.message };
        });
    }

    // Make the POST request to FLASK_URL/query
    const response = await axios.post(`${process.env.FLASK_URL}/query`, {
        question: req.body.message,
        history: history
    });

    const aiResponseMarkdown = response.data.answer;
    const aiResponseHtml = converter.makeHtml(aiResponseMarkdown); // Convert Markdown to HTML

    const aiMessage = new Message({ user: 'assistant', message: aiResponseHtml });
    await aiMessage.save();
    chat.messages.push(aiMessage);
    await chat.save();

    res.status(201).json(aiMessage);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error sending message', error: error.message });
    }
};

exports.getChats = async (req, res) => {
    const { userId, topic } = req.query;
    const chats = await Chat.find({ owner: userId, topic: topic }, 'name');
    if (chats.length === 0) {
        res.send('No chats available');
    } else {
        const chatList = chats.map(chat => ({ name: chat.name, id: chat._id }));
        res.status(200).json(chatList);
    }
};

exports.getMessages = async (req, res) => {
    try {
    const chat = await Chat.findOne({ _id: req.params.id, owner: req.userId }).populate('messages');
    if (!chat) {
        console.log(chat);
        return res.status(404).send('Chat not found or you do not have permission');
    }

    const messages = chat.messages
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sort messages by timestamp
        .map(message => {
            return { user: message.user, message: message.message };
        });
    res.status(200).json(messages);

    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error fetching messages', error: error.message });
    }
};