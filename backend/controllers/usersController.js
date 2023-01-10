const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc Recupérer tous les users
// @route GET /api/users
// @access private
const getAllUsers = asyncHandler(async (req, res) => {
    User.find()
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => res.status(400).json({ error: "Aucun Utilisateurs" }));
})


// @desc Recupérer un user
// @route GET /api/users/:id
// @access private
const getUser = asyncHandler(async (req, res) => {
    await User.findById(req.params.id)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((error) => res.status(400).json({ error: "l'Utilisateur n'existe pas" }));
})



// @desc inscription d'un utilisateur
// @route POST /api/users/
// @access public
const registerUser = asyncHandler(async (req, res) => {

    const { pseudo, mail, password } = req.body;

    if (!pseudo || !mail || !password) {

        res.status(400);
        throw new Error('Please add all fields');
    }

    // Utilisateur déjà éxistant
    const userMailExists = await User.findOne({mail});
    const userPseudoExists = await User.findOne({pseudo});

    if(userMailExists){
        res.status(400);
        throw new Error('Adresse mail déja utilisée');
    }
    if(userPseudoExists){
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
        password: hashedPassword
    })

    if (user) {
        res.status(200);
        res.json({
            _id: user.id,
            pseudo: user.pseudo,
            email: user.mail,
            token: generateToken(user._id),
        })
    } else {
        res.status(400);
        throw new Error('Données utilisateur non valides')
    }

})


// @desc Authentifier un utilisateur
// @route POST /api/users/login
// @access public
const login = asyncHandler(async (req, res) => {
    const { mail, password } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ mail });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            pseudo: user.pseudo,
            email: user.mail,
            token: generateToken(user._id),
        })
    } else {
        res.status(401);
        throw new Error('Identifiants ou mdp incorrects');
    }
})

// Génération du token

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// @desc Récupérer les données d'user
// @route GET /api/users/me
// @access private

const getMe = asyncHandler(async (req, res) => {
    const { id, mail, pseudo } = await User.findById(req.user.id);

    res.status(200).json({
        id,
        email: mail,
        pseudo,
    })
})


// @desc Modifier infos user
// @route PUT /api/users/:id
// @access private
const updateUser = asyncHandler(async (req, res) => {

    const { pseudo, mail, password, bio, image, isAdmin } = req.body;

    // Vérifier si aucun champs est remplir
    if (!req.body) {
        res.status(400);
        throw new Error('Veuillez remplir au moins un champs !');

    } // Vérifier si au moins un champs est remplir
    else {

        const user = await User.findById(req.params.id);

        // Vérifier si l'utilisateur existe
        if (!req.params.id) {
            res.status(400);
            throw new Error("Aucun utilisateur trouvé");
        } else {
            // Vérifier si le champs pseudo est remplir
            if (pseudo) {
                // Vérifier si l'utilisateur existe puis le modifier
                User.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $set: {
                            pseudo: pseudo,
                        },
                    }).then(() => {
                        res.status(200).json({
                            message: "Utilisateur bien modifiée !"
                        })
                    })
            }

            // Vérifier si le champs mail est remplir
            if (mail) {
                // Vérifier si l'utilisateur existe puis le modifier
                User.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $set: {
                            mail: mail,
                        },
                    }).then(() => {
                        res.status(200).json({
                            message: "Utilisateur bien modifiée !"
                        })
                    })
            }

            // Vérifier si le champs password est remplir
            if (password) {
                // Vérifier si l'utilisateur existe puis le modifier
                User.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $set: {
                            password: password,
                        },
                    }).then(() => {
                        res.status(200).json({
                            message: "Utilisateur bien modifiée !"
                        })
                    })
            }

            // Vérifier si le champs bio est remplir
            if (bio) {
                // Vérifier si l'utilisateur existe puis le modifier
                User.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $set: {
                            bio: bio,
                        },
                    }).then(() => {
                        res.status(200).json({
                            message: "Utilisateur bien modifiée !"
                        })
                    })
            }

            // Vérifier si le champs image est remplir
            if (image) {
                // Vérifier si l'utilisateur existe puis le modifier
                User.findOneAndUpdate(
                    { _id: req.params.id },
                    {
                        $set: {
                            image: image,
                        },
                    }).then(() => {
                        res.status(200).json({
                            message: "Utilisateur bien modifiée !"
                        })
                    })
            }
        }
    }
})


// @desc Supprimer un user
// @route DELETE /api/users/:id
// @access private
const deleteUser = asyncHandler(async (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => res.json({ message: "l'utilisateur à bien été supprimer" }))
        .catch((error) => res.status(400).json({ error: "Aucun Utilisateur trouvé" }));

})


// @desc Modifier les droit d'un user en entant admin
// @route PUT /api/users/:id
// @access private
const updateUserAdmin = asyncHandler(async (req, res) => {

    const { isAdmin } = req.body;

    const user = await User.findById(req.user.id);

    if (user.isAdmin === false) {
        res.status(401);
        throw new Error("Vous n'êtes pas autorisé à modifier le role de cet utilisateur");
    } else {
        // Vérifier si le champs isAdmin est remplir
        if (isAdmin) {
            // Vérifier si l'utilisateur existe puis le modifier
            User.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        isAdmin: isAdmin,
                    },
                }).then(() => {
                    res.status(200).json({
                        message: "Utilisateur bien modifiée !"
                    })
                })
        }
    }
})


// @desc Supprimer un user en etant admin
// @route DELETE /api/users/:id
// @access private
const deleteUserAdmin = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id);

    if (user.isAdmin === false) {
        res.status(401);
        throw new Error("Vous n'êtes pas autorisé à supprimer un utilisateur");
    } else {
        User.deleteOne({ _id: req.params.id })
            .then(() => res.json({ message: "l'utilisateur à bien été supprimer" }))
            .catch((error) => res.status(400).json({ error: "Aucun Utilisateur trouvé" }));
    }
})

module.exports = {
    getAllUsers,
    getUser,
    registerUser,
    login,
    getMe,
    updateUser,
    deleteUser,
    updateUserAdmin,
    deleteUserAdmin
};