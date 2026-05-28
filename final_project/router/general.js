const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Axios-ыг дээр нь import хийнэ

// ТАЙЛБАР: Хэрэв Axios-оор өөрийн endpoint-руу хандах бол 
// дараах байдлаар Async/Await ашиглан гүйцэтгэнэ.

// 1. Бүх номыг авах (Task 10)
public_users.get('/', async function (req, res) {
  try {
    // Танд байгаа бодит порт болон хаягийг тавина (Жишээ нь: localhost:5000)
    // Шууд books өгөгдлийг Promise-оор буцааж болох удирдамжтай:
    const getBooks = () => Promise.resolve(books);
    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// 2. ISBN-ээр ном хайх (Task 11)
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({message: err}));
});
  
// 3. Зохиолчийн нэрээр ном хайх (Task 12)
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author.toLowerCase();
    const getBooksByAuthor = () => Promise.resolve(
      Object.values(books).filter(book => book.author.toLowerCase() === author)
    );
    const filteredBooks = await getBooksByAuthor();
    
    if (filteredBooks.length > 0) {
      return res.status(200).json(filteredBooks);
    } else {
      return res.status(404).json({message: "No books found by this author"});
    }
  } catch (error) {
    return res.status(500).json({message: "Server error"});
  }
});

// 4. Гарчигаар ном хайх (Task 13)
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  
  const getBooksByTitle = new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject("No books found with this title");
    }
  });

  getBooksByTitle
    .then((booksList) => res.status(200).json(booksList))
    .catch((err) => res.status(404).json({message: err}));
});

// Номын шүүмж авах хэсэг
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports = {
  general: public_users
};
