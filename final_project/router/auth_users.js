const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(u => u.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(u => u.username === username && u.password === password);
};

// Task 7: Login as a registered user
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username }, "access", { expiresIn: '1h' });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login successful." });
  } else {
    return res.status(401).json({ message: "Invalid username or password." });
  }
});

// Task 8: Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review text is required as a query parameter." });
    }
  
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "The review for the book with ISBN " + isbn + " has been added/updated.",
      reviews: books[isbn].reviews
    });
  });
  
  // Task 9: Delete a book review
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No review found for this user on the given ISBN." });
    }
  
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Reviews for the book with ISBN " + isbn + " has been deleted."
    });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;