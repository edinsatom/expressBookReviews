const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username.length < 3 || password.length < 4) {
    return res.status(404).json({ message: "Invalid username and/or password." })
  }
  if (isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({ message: "User register success." });
  }
  return res.status(404).json({ message: "Invalid user name." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

const getBooks = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log(response.data);
  }
  catch (error) {
    console.error(error);
  }
}

// getBooks()

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  return res.status(200).json(book);
});

const getBookByIsbn = function (isbn) {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then((resp) => console.log(resp.data))
    .catch((err) => console.log(err))
}

// getBookByIsbn(2)

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  const result = {}
  Object.entries(books).forEach(([key, value]) => {
    if (value.author === author) result[key] = value
  })

  return res.status(200).json(result);
});

function getBookByAuthor(author) {
  return axios.get(`http://localhost:5000/author/${author}`)
}

// getBookByAuthor('Hans Christian Andersen')
//   .then((data) => console.log(data.data))
//   .catch((err) => console.err(err))

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  const result = {}
  Object.entries(books).forEach(([key, value]) => {
    if (value.title === title) result[key] = value;
  })
  return res.status(200).json(result);
});


const getBookByTitle = async (title) => {
  await axios.get(`http://localhost:5000/title/${title}`)
  .then( data => console.log(data.data))
  .catch( (err) => console.error(err))

}

// getBookByTitle('Fairy tales')

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const result = books[isbn].reviews
  return res.status(200).json({ reviews: result });
});

module.exports.general = public_users;
