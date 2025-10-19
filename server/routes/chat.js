const express = require('express');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');
const router = express.Router();

// @route   GET /api/chat
// @desc    Get all chats for the current user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'username avatar status lastSeen')
      .populate('lastMessage')
      .sort({ lastMessageTime: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

// @route   POST /api/chat
// @desc    Create a new chat
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { participants, isGroup = false, groupName, groupDescription } = req.body;
    const currentUserId = req.user._id;

    // Add current user to participants if not already included
    const allParticipants = [...new Set([currentUserId.toString(), ...participants])];

    // Check if it's a direct chat (2 participants)
    if (!isGroup && allParticipants.length === 2) {
      // Check if chat already exists
      const existingChat = await Chat.findOne({
        participants: { $all: allParticipants },
        isGroup: false
      });

      if (existingChat) {
        return res.json(existingChat);
      }
    }

    const chat = new Chat({
      participants: allParticipants,
      isGroup,
      groupName: isGroup ? groupName : null,
      groupDescription: isGroup ? groupDescription : null
    });

    await chat.save();
    await chat.populate('participants', 'username avatar status lastSeen');

    res.status(201).json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Error creating chat' });
  }
});

// @route   GET /api/chat/:chatId/messages
// @desc    Get messages for a specific chat
// @access  Private
router.get('/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant in the chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      return res.status(403).json({ message: 'Access denied to this chat' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'username avatar')
      .populate('replyTo')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// @route   POST /api/chat/:chatId/messages
// @desc    Send a message to a chat
// @access  Private
router.post('/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, type = 'text', mediaUrl, replyTo } = req.body;
    const senderId = req.user._id;

    // Verify user is participant in the chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: senderId
    });

    if (!chat) {
      return res.status(403).json({ message: 'Access denied to this chat' });
    }

    const message = new Message({
      chat: chatId,
      sender: senderId,
      content,
      type,
      mediaUrl,
      replyTo
    });

    await message.save();
    await message.populate('sender', 'username avatar');
    await message.populate('replyTo');

    // Update chat's last message
    chat.lastMessage = message._id;
    chat.lastMessageTime = new Date();
    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
});

// @route   PUT /api/chat/:chatId/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put('/:chatId/messages/:messageId/read', async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if already read by this user
    const alreadyRead = message.readBy.some(read => read.user.toString() === userId.toString());
    
    if (!alreadyRead) {
      message.readBy.push({
        user: userId,
        readAt: new Date()
      });
      await message.save();
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Error marking message as read' });
  }
});

module.exports = router;

