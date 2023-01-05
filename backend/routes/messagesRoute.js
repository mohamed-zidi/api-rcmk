const express = require('express');
const { getAllMessages, setMessage, deleteMessage, getMessage,updateMessage } = require('../controllers/messagesController');
const router = express.Router();

router.route('/').get(getAllMessages).post(setMessage);
router.route('/:id').get(getMessage).delete(deleteMessage).put(updateMessage);

module.exports = router;