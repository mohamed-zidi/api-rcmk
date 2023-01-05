const express = require('express');
const { getAllUsers, getUser, register, updateUser } = require('../controllers/usersController');
const router = express.Router();

router.route('/:id').get(getUser).put(updateUser);
router.get('/',getAllUsers);


router.post('/register', register);




module.exports = router;