const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let found = users.filter((user) => {
        return user.username === username;
    });
    return found.length == 0;
}

const authenticatedUser = (username,password)=>{
    let found = users.filter((user) => {
        return user.username == username && user.password == password;
    });
    return found.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
  
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        let book = books[isbn];
        book['isbn'] = isbn;
        book['reviews'][req.session.authorization.username] = req.body.review;
        res.send(JSON.stringify(book,null,4));
    } else {
        return res.status(404).json({message: "Not found!"});
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        let book = books[isbn];
        book['isbn'] = isbn;
        if (book['reviews'][req.session.authorization.username]) {
            delete book['reviews'][req.session.authorization.username];
        }
        res.send(JSON.stringify(book,null,4));
    } else {
        return res.status(404).json({message: "Not found!"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
