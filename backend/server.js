const express = require('express');
const { use } = require('./routes/usersRoute');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const { errorHandler } = require('./middleware/errorMiddleware');
const colors = require('colors');
const dbConnect = require('./config/db')
const cors = require('cors');
const helmet = require('helmet');

dbConnect();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/users',require('./routes/usersRoute'));
app.use('/api/messages',require('./routes/messagesRoute'));

app.use(errorHandler)
app.listen(port,()=>{
    console.log(`server started on port ${port}`);
});