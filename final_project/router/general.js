const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
var users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    if (!req.body.username) {
        return res.status(400).json({message: "You must supply username."});
    }
    if (!req.body.password) {
        return res.status(400).json({message: "You must supply password."});
    }
    if (!isValid(req.body.username)) {
        return res.status(400).json({message: "Username is taken."});
    }
    users.push({
        "username": req.body.username,
        "password": req.body.password
    });
    return res.status(200).json({message: "User successfuly created!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        let book = books[isbn];
        book['isbn'] = isbn;
        res.send(JSON.stringify(book,null,4));
    } else {
        return res.status(404).json({message: "Not found!"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let filtered_books = {};
    for (let b in books) {
        if (books[b].author == author) {
            filtered_books[b] = books[b];
        }
    }
    res.send(JSON.stringify(filtered_books,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let filtered_books = {};
    for (let b in books) {
        if (books[b].title == title) {
            filtered_books[b] = books[b];
        }
    }
    res.send(JSON.stringify(filtered_books,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.send(JSON.stringify(books[isbn].reviews,null,4));
    } else {
        return res.status(404).json({message: "Not found!"});
    }
});

public_users.get('/async_await_books',async function (req, res) {
    const URL = 'https://volodymyrvol-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/';
    const apiPath = (path) => URL + path;
    let result = await axios.get(apiPath('/'))
        .then((result) => {
            return res.status(404).json(result.data);
        })
        .catch((error) => {
            return res.status(404).json({message: "Not found!"});
        });
});

public_users.get('/async_await_isbn',async function (req, res) {
    const URL = 'https://volodymyrvol-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/';
    const apiPath = (path) => URL + path;
    let result = await axios.get(apiPath('/isbn/5'))
        .then((result) => {
            return res.status(404).json(result.data);
        })
        .catch((error) => {
            return res.status(404).json({message: "Not found!"});
        });
});

public_users.get('/async_await_author',async function (req, res) {
    const URL = 'https://volodymyrvol-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/';
    const apiPath = (path) => URL + path;
    let result = await axios.get(apiPath('/author/Unknown'))
        .then((result) => {
            return res.status(404).json(result.data);
        })
        .catch((error) => {
            return res.status(404).json({message: "Not found!"});
        });
});

public_users.get('/async_await_title',async function (req, res) {
    const URL = 'https://volodymyrvol-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/';
    const apiPath = (path) => URL + path;
    let result = await axios.get(apiPath('/title/The Book Of Job'))
        .then((result) => {
            return res.status(404).json(result.data);
        })
        .catch((error) => {
            return res.status(404).json({message: "Not found!"});
        });
});


module.exports.general = public_users;
