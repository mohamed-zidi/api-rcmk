const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc Recupérer tous les users
// @route GET /api/users
// @access private
const getAllUsers = asyncHandler(async (req,res) => {
    const users = await User.find();
    res.status(200).json(users);
})


// @desc Recupérer un user via son id
// @route GET /api/users/find/:id
// @access private
const getUser = asyncHandler(async (req,res) => {
    const user = await User.findById(req.params.id);
    if(!user){
        res.status(400);
        res.json('Utilisateur introuvable');
    }
    res.status(200).json({
        _id:user.id,
        pseudo:user.pseudo,
        mail:user.mail
    })
})


// @desc Recupérer infos user authentifé(token)
// @route GET /api/users/me
// @access private
const getMe = asyncHandler(async (req,res) => {
    const { _id,mail,pseudo } = await User.findById(req.user.id)
    res.status(200).json({
        _id:_id,
        mail:mail,
        pseudo:pseudo
    })
})


// @desc Modifier infos user
// @route PUT /api/users/:id
// @access private
const updateMe = asyncHandler(async (req,res) => {
    const { mail,pseudo } = await User.findById(req.user.id);

    console.log(req.body);
    if(!mail||!pseudo){
        res.status(400);
        throw new Error('Utilisateur introuvable');
    }

    if(!req.body.mail||!req.body.pseudo){
        res.status(400);
        throw new Error('Données manquantes pour modifier vos données');
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id,req.body,
        {
            new:true
        })
        
    res.status(200).json(updatedUser);
    

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
    const userMailExists = await User.findOne({mail});
    const userPseudoExists = await User.findOne({pseudo});

    if(userMailExists){
        res.status(400);
        throw new Error('Adresse mail déja utilisée');
    }else if(userPseudoExists){
        res.status(400);
        throw new Error('Pseudo déjà utilisé,veuillez en choisir un autre');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        pseudo,
        mail,
        password:hashedPassword,
    })

    if(user){
        res.status(201);
        res.json({
            _id:user.id,
            pseudo:user.pseudo,
            email:user.mail,
            token:generateToken(user._id)
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
    const {mail,password} = req.body;

    const user = await User.findOne({mail});

    if(user && (await bcrypt.compare(password,user.password))){
        res.status(201);
        res.json({
            _id:user.id,
            pseudo:user.pseudo,
            email:user.mail,
            token:generateToken(user._id)
        })
    }else{
        res.status(400);
        throw new Error('Identifiants invalide')
    }
})


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn:'30d'
    })
}

module.exports = {
    getAllUsers,
    getUser,
    registerUser,
    updateMe,
    login,
    getMe
};