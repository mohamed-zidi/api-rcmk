const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc Recupérer tous les users
// @route GET /api/users
// @access private
const getAllUsers = asyncHandler(async (req,res) => {

    res.status(200).json({response:"get all users"});
})


// @desc Recupérer un user
// @route GET /api/users/:id
// @access private
const getUser = asyncHandler(async (req,res) => {

    res.status(200).json({response:`get user by id ${req.params.id}`})
})


// @desc Modifier infos user
// @route PUT /api/users/:id
// @access private
const updateUser = asyncHandler(async (req,res) => {
    
    res.status(200).json({response:`modifier infos user ${req.params.id}`})
})


// @desc inscription d'un utilisateur
// @route POST /api/users
// @access public
const registerUser = asyncHandler(async (req,res) => {

    const { pseudo,mail,password } = req.body;

    if(!pseudo || !mail || !password){

        res.status(400);
        throw new Error('Please add all fields');
    }

    // Utilisateur déjà éxistant
    const userExists = await User.findOne({mail});
    if(userExists){
        res.status(400);
        throw new Error('Adresse mail déja utilisée');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        pseudo,
        mail,
        password:hashedPassword
    })

    if(user){
        res.status(200);
        res.json({
            _id:user.id,
            pseudo:user.pseudo,
            email:user.mail
        })
    }else{
        res.status(400);
        throw new Error('Données utilisateur non valides')
    }

})


// @desc Authentifier un utilisateur
// @route POST /api/users/login
// @access public
const login = asyncHandler( async (req,res) => {
    
    res.status(201).json({response:"register"});
})


module.exports = {
    getAllUsers,
    getUser,
    registerUser,
    updateUser
};