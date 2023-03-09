const express = require('express');
const { use } = require('./routes/usersRoute');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const { errorHandler } = require('./middleware/errorMiddleware');
const colors = require('colors');
const dbConnect = require('./config/db')
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

module.exports = io;

// Code pour créer une connexion WebSocket
io.on('connection', socket => {
    console.log('Un client est connecté.');
    
    socket.on('send_message',(msg)=>{
        console.log(msg);
    })

    socket.on('disconnect', ()=>{
        console.log('Un client est déconnecté.');
    })
});

dbConnect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/users',require('./routes/usersRoute'));
app.use('/api/messages',require('./routes/messagesRoute'));

app.use(errorHandler)
// app.listen(port,()=>{
//     console.log(`server started on port ${port}`);
// });

// Code pour démarrer le serveur
http.listen(port, () => {
    console.log(`server started on port ${port}`);
  });