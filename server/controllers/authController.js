const bcrypt = require('bcryptjs');

async function register(req, res) {
  const { username, password, isAdmin } = req.body;
  const db = req.app.get("db");
  //This query will check the database to see if the username is already taken.
  // Since this query is asynchronous, make sure to use the await keyword to ensure that the promise resolves before the rest of the code executes.
  const result = await db.get_user([username]);
  const existingUser = result[0];
  if (existingUser) {
    res.status(409).json("Username taken!");
  }
    // let salt = bcrypt.genSaltSync(10);
    let hash = await bcrypt.hash(password, 10);
  const registeredUser = await db.register_user([isAdmin, username,hash]);
  //([isAdmin, username, hash]) I didn't use arry
  const user = registeredUser[0];
  req.session.user = {
    isAdmin: user.is_admin,
    username: user.username,
    id: user.id
  };
  res.status(201).json(req.session.user);
}
async function login(req,res){
  const{username,password}= req.body;
  const db = req.app.get('db');

  const foundUser = await db.get_user([username]);
  const user = foundUser[0];
  if(!user){
    res.status(401).json('User not found, Please register as a new user before logging in.');
  }
  //This method compares the password entered by the user at login to the hashed and salted version stored in the database.
  const isAuthenticated = await bcrypt.compare(password,user.hash);
  if (!isAuthenticated){
    res.status(403).json('INCORRECT PASSWORD');
  }
  req.session.user = {
    isAdmin: user.is_admin,
    username:user.username,
    id: user.id
  }
  res.status(200).json(req.session.user);
}

async function logout(req,res){
  req.session.destroy();
  res.sendStatus(200);
}

module.exports = {
  register,
  login,
  logout
};

// let result = [{
//     username :"x",
//     password: "asdfasdf",
//     isAdmin: true
// }]

// result = [];

// let existingUser = result[0]
