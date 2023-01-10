const express = require('express');
const { getAllUsers, getUser, registerUser, login, getMe, updateMe } = require('../controllers/usersController');
const router = express.Router();
const protect = require('../middleware/authMiddleware');

// routes nécessitant une authentification
// router.route('/:id').put(protect,updateMe);
router.get('/find/:id',protect,getUser);
router.get('/',protect,getAllUsers);
router.route('/me').get(protect,getMe).put(protect,updateMe);

// routes sans authentification
router.post('/', registerUser);
router.post('/login', login);



module.exports = router;