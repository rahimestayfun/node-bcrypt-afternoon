const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');

const app = express();

const {SERVER_PORT,CONNECTION_STRING,SESSION_SECRET} = process.env;
const {register,login,logout} = require('./controllers/authController');
const {dragonTreasure,getUserTreasure,addUserTreasure,getAllTreasure} = require('./controllers/treasureController');
const {usersOnly,adminOnly}= require('./middleware/authMiddleware')

massive(CONNECTION_STRING).then(db=>{
    app.set('db',db);
    console.log('Db connected.')
})

app.use(express.json());
app.use(session({
    resave:true,
    saveUninitialized:true,
    secret:SESSION_SECRET
}))

//auth controller
app.post('/auth/register',register);
app.post('/auth/login',login);
app.get('/auth/logout',logout)

//treasure controller
app.get('/api/treasure/dragon',dragonTreasure);
app.get('/api/treasure/user',usersOnly,getUserTreasure);
app.post('/api/treasure/user',usersOnly,addUserTreasure);
app.get('/api/treasure/all',usersOnly,adminOnly,getAllTreasure);


app.listen(SERVER_PORT,()=>console.log(`Server is on ${SERVER_PORT}`));