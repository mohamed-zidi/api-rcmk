const express = require('express');
const { getAllMessages, setMessage, deleteMessage, getMessage,updateMessage } = require('../controllers/messagesController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getAllMessages).post(protect, setMessage);
router.route('/:id').get(protect, getMessage).delete(protect, deleteMessage).put(protect, updateMessage);

module.exports = router;