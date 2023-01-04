const asyncHandler = require('express-async-handler');

// @desc Recupérer tous les messages
// @route GET /api/messages
// @access private
const getAllMessages = asyncHandler( async (req,res) => {
    
    res.status(200).json({response:"get all messages"})
})


// @desc Recupérer un message
// @route GET /api/messages/:id
// @access private
const getMessage = asyncHandler( async (req,res) => {
    
    res.status(200).json({response:`get message numéro: ${req.params.id}`})
})


// @desc Enregistrer un message
// @route POST /api/messages
// @access private
const setMessage = asyncHandler( async  (req,res) => {
    if(!req.body.text){
        res.status(400);
        throw new Error("Aucun message n'a été envoyé");
    }else{
        console.log(req.body.text);
        res.status(200).json({response:"Message enregistré"});
    }
})


// @desc Supprimer un message
// @route DELETE /api/messages/:id
// @access private
const deleteMessage = asyncHandler( async (req,res) => {
    if(!req.params.id){
        res.status(400).json({response:`Suppression impossible, paramètre manquant`});
        throw new Error("Aucun message n'a été envoyé");
    }
    res.status(200).json({response:`message ${req.params.id} supprimé`})
})


module.exports = { 
    getAllMessages,
    setMessage,
    deleteMessage,
    getMessage
 }