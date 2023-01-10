const asyncHandler = require('express-async-handler');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

// @desc Recupérer tous les messages
// @route GET /api/messages
// @access private
const getAllMessages = asyncHandler( async (req,res) => {
    const messages = await Message.find();
    res.status(200).json(messages);
})


// @desc Recupérer un message
// @route GET /api/messages/:id
// @access private
const getMessage = asyncHandler( async (req,res) => {
    if(!req.params.id){
        res.status(400);
        throw new Error("Message non trouvé");
    } else{
        const message = await Message.findById(req.params.id);

        res.status(200).json(message)
    }
})


// @desc Enregistrer un message
// @route POST /api/messages
// @access private
const setMessage = asyncHandler( async  (req,res) => {
    if(!req.body.text){
        res.status(400);
        throw new Error("Aucun message n'a été envoyé");
    }else{
        const message = await Message.create({
            text: req.body.text,
            user :req.user.id
        })
        console.log(req.body.text);
        res.status(200).json(message);
    }
})


// @desc Modifier un message
// @route POST /api/messages/:id
// @access private
const updateMessage = asyncHandler( async  (req,res) => {

    const message = await Message.findById(req.params.id);
    
    if(!message){
        res.status(400);
        throw new Error("Aucun message trouvé");
    }

    if(!req.body.text){
        res.status(400);
        throw new Error("Body de la requête vide");
    }

    const user = await User.findById(req.user.id);
    if(!user){
        console.log(5);
        res.status(401);
        throw new Error('Utilisateur introuvable')
    }
    // Seulement l'utilisateur connecté peut modifier son propre message
    if(message.user.toString() !== user.id){
        console.log(6);
        res.status(401);
        throw new Error('Utilisateur non autorisé')
    }
    const updatedMessage = await Message.findByIdAndUpdate(req.params.id,req.body,
            {
                new:true
            })
                
            res.status(200).json(updatedMessage);
})
    



// @desc Supprimer un message
// @route DELETE /api/messages/:id
// @access private
const deleteMessage = asyncHandler( async (req,res) => {
    const message = await Message.findById(req.params.id);
    
    if(!req.params.id){
        res.status(400);
        throw new Error("Aucun message n'a été envoyé");
    }else{

        await message.remove();
        res.status(200).json({id:req.params.id})
    }
})


module.exports = { 
    getAllMessages,
    setMessage,
    deleteMessage,
    getMessage,
    updateMessage
 }