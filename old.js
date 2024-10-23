// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const axios = require('axios'); // For making API requests
// const uri = "mongodb+srv://vikassingh22:X4shuQ9GNkEsWCTP@cluster0.tj0im.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// // Initialize Express
// const app = express();
// const genAI = new GoogleGenerativeAI("AIzaSyCdZodCN86sAt6RWZwMZooG1xCco092-10");

// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
// // Use body-parser to parse JSON bodies into JS objects
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect(uri).then(() => {
//   console.log('Connected to MongoDB');
// }).catch((err) => {
//   console.log('Failed to connect to MongoDB', err);
// });

// // Define Message Schema
// const MessageSchema = new mongoose.Schema({
//   user: String,
//   message: String,
//   timestamp: { type: Date, default: Date.now }
// });

// // Define Chat Schema
// const ChatSchema = new mongoose.Schema({
//   name: String,
//   messages: [MessageSchema]
// });

// const Chat = mongoose.model('Chat', ChatSchema);

// app.get('/',(req,res)=>{
//     res.send("Use /chat or /chat/:chatid/messages to read\n");
//     return;
// });

// // Create Chat (POST)
// app.post('/chats', async (req, res) => {
//   const chat = new Chat({ name: req.body.name });
//   await chat.save();
//   res.status(201).send(chat+"\n");
// });

// // Rename Chat (PUT)
// app.put('/chats/:id', async (req, res) => {
//   const chat = await Chat.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
//   res.send(chat+"\n");
// });

// // Delete Chat (DELETE)
// app.delete('/chats/:id', async (req, res) => {
//   await Chat.findByIdAndDelete(req.params.id);
//   res.status(204).send();
// });

// // Send Message (POST)
// app.post('/chats/:id/messages', async (req, res) => {
//     const chat = await Chat.findById(req.params.id);
//     if (!chat) {
//         return res.status(404).send('Chat not found');
//     }
  
//     const userMessage = { user: 'user', message: req.body.message };
//     chat.messages.push(userMessage);
  
//     // Simulate sending message to AI chatbot and getting a response
//     const aiResponse = await getAIResponse(req.body.message);
//     const aiMessage = { user: 'ai', message: aiResponse };
//     chat.messages.push(aiMessage);
  
//     await chat.save();
  
//     // Beautify and send the response
//     res.status(201).send(JSON.stringify(chat, null, 2));
//   });

// // Get List of Chats (GET)
// app.get('/chats', async (req, res) => {
//     const chats = await Chat.find({}, 'name');
//     if (chats.length === 0) {
//         res.send('No chats available\n');
//     } else {
//         const chatList = chats.map(chat => `Name: ${chat.name}, ID: ${chat._id}`).join('\n');
//         res.send(chatList + "\n");
//     }
// });

// // Get Messages in a Chat (GET)
// app.get('/chats/:id/messages', async (req, res) => {
//     const chat = await Chat.findById(req.params.id);
//     if (!chat) {
//         return res.status(404).send('Chat not found');
//     }
  
//     const formattedMessages = chat.messages.map(message => {
//       const istTime = new Date(message.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
//       return `${message.user} (${istTime}):\n${message.message}`;
//     }).join('\n\n');
  
//     res.send(formattedMessages + "\n");
//   });


// // Placeholder function to simulate AI chatbot response
// async function getAIResponse(message) {
//     const result = await model.generateContent(message);
//     return (result.response.text());
// }

// // Start the server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });