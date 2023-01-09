const express = require('express');
const { getAllUsers, getUser, registerUser, login, getMe, updateUser, deleteUser } = require('../controllers/usersController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(registerUser).get(protect, getAllUsers);
router.route('/:id').get(protect, getUser).delete(protect, deleteUser).put(protect, updateUser);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;