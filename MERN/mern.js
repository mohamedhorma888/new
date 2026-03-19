const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/mern-app');

// Schema
const MessageSchema = new mongoose.Schema({ text: String });
const Message = mongoose.model('Message', MessageSchema);

// Routes
app.get('/messages', async (req, res) => {
    const messages = await Message.find();
    res.json(messages);
});

app.post('/messages', async (req, res) => {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.json(newMessage);
});

app.listen(5000, () => console.log('Server running on port 5000'));