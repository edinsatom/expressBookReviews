const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  const userWithTheSameName = users.filter( x => x.username === username )
  return !userWithTheSameName.length > 0
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const validusers = users.filter((user) => user.username === username && user.password === password)

  return validusers.length > 0
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) return res.status(404).json({message: "Error logging in"});

  if(authenticatedUser(username, password)) {
    const accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).send("User successfully logged in");
  }
  else {
    return res.status(208).json({message: "Invalid login. check username and password."})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if(req.session.authorization){
    const token = req.session.authorization['accessToken'];
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    jwt.verify(token, "access", (err, decodeToken) => {
      if(!err) {
        if(req.body.review){
          books[isbn].reviews[username] = req.body.review
          return res.status(200).json({message: "Review updated!"})
        }
        else {
          return res.status(404).json({message: "Bad request!"})
        }
      }
      else {
        return res.status(300).json({ message: "You must be loged to use this service" });
      }
    })
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Write the code here
  if(req.session.authorization) {
    const token = req.session.authorization['accessToken']
    const username = req.session.authorization['username']
    jwt.verify(token, "access", (err, decodeToken) => {
      if(!err){
        const isbn = req.params.isbn;
        delete books[isbn].reviews[username]
        return res.status(200).json({message: "This review has been deleted"})
      }
      else {
        return res.status(300).json({ message: "You must be loged to use this service" });
      }
    })
  }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
