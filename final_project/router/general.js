const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const BASE_URL = "http://localhost:5000";

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const userExists = users.some(u => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists. Please choose a different one." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

// Task 1: Get the book list (sync)
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book by ISBN (sync)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Task 3: Get books by author (sync)
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  bookKeys.forEach(key => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author." });
  }
});

// Task 4: Get books by title (sync)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const matchingBooks = [];

  bookKeys.forEach(key => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push({ isbn: key, ...books[key] });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title." });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (Object.keys(book.reviews).length === 0) {
    return res.status(200).json({ message: "No reviews found for this book." });
  }

  return res.status(200).json(book.reviews);
});

// Task 10: Get all books using async-await with Axios
public_users.get('/async/books', async (req, res) => {
    try {
      const getAllBooks = () => {
        return new Promise((resolve, reject) => {
          resolve(books);
        });
      };
      const allBooks = await getAllBooks();
      return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
      return res.status(500).json({ message: "Error fetching books.", error: error.message });
    }
  });
  
  // Task 11: Get book by ISBN using async-await with Axios
  public_users.get('/async/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
      const getBookByISBN = () => {
        return new Promise((resolve, reject) => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject({ status: 404, message: "Book not found." });
          }
        });
      };
      const book = await getBookByISBN();
      return res.status(200).json(book);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  });
  
  // Task 12: Get books by author using async-await with Axios
  public_users.get('/async/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
      const getBooksByAuthor = () => {
        return new Promise((resolve, reject) => {
          const bookKeys = Object.keys(books);
          const matchingBooks = [];
          bookKeys.forEach(key => {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
              matchingBooks.push({ isbn: key, ...books[key] });
            }
          });
          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject({ status: 404, message: "No books found for this author." });
          }
        });
      };
      const matchingBooks = await getBooksByAuthor();
      return res.status(200).json(matchingBooks);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  });
  
  // Task 13: Get books by title using async-await with Axios
  public_users.get('/async/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
      const getBooksByTitle = () => {
        return new Promise((resolve, reject) => {
          const bookKeys = Object.keys(books);
          const matchingBooks = [];
          bookKeys.forEach(key => {
            if (books[key].title.toLowerCase() === title.toLowerCase()) {
              matchingBooks.push({ isbn: key, ...books[key] });
            }
          });
          if (matchingBooks.length > 0) {
            resolve(matchingBooks);
          } else {
            reject({ status: 404, message: "No books found with this title." });
          }
        });
      };
      const matchingBooks = await getBooksByTitle();
      return res.status(200).json(matchingBooks);
    } catch (error) {
      return res.status(error.status || 500).json({ message: error.message });
    }
  });

module.exports.general = public_users;