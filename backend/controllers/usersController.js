// @desc Recupérer tous les users
// @route GET /api/users
// @access private
const getAllUsers = (req,res) => {

    res.status(200).json({response:"get all users"});
}


// @desc Recupérer un user
// @route GET /api/users/:id
// @access private
const getUser = (req,res) => {

    res.status(200).json({response:`get user by id ${req.params.id}`})
}


// @desc Modifier infos user
// @route PUT /api/users/:id
// @access private
const updateUser = (req,res) => {
    
    res.status(200).json({response:`modifier infos user ${req.params.id}`})
}


// @desc inscription d'un utilisateur
// @route POST /api/users/register
// @access public
const register = (req,res) => {
    
    res.status(201).json({response:"register"});
}

module.exports = {
    getAllUsers,
    getUser,
    register,
    updateUser
};