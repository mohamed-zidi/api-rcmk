const express = require('express');
const { getAllUsers, getUser, registerUser, updateUser } = require('../controllers/usersController');
const router = express.Router();

router.route('/:id').get(getUser).put(updateUser);
router.get('/',getAllUsers);


router.post('/', registerUser);




module.exports = router;