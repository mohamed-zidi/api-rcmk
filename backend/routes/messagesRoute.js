const express = require('express');
const { getAllMessages, setMessage, deleteMessage, getMessage } = require('../controllers/messagesController');
const router = express.Router();

router.route('/').get(getAllMessages).post(setMessage);

router.route(':id').get(getMessage).delete(deleteMessage);

router.get('/:id', getMessage);


router.delete('/:id', deleteMessage);

module.exports = router;