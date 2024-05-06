let books = [];

loadBooksFromLocalStorage();

displayBooks();

const inputBookForm = document.getElementById("inputBook");
inputBookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const bookTitle = document.getElementById("inputBookTitle").value;
  const bookAuthor = document.getElementById("inputBookAuthor").value;
  const bookYear = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const newBook = {
    id: generateBookId(),
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete: isComplete,
  };

  books.push(newBook);
  saveBooksToLocalStorage();
  displayBooks();
});

const searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm)
  );

  displayBooks(filteredBooks);
});

function displayBooks(filteredBooks = books) {
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  incompleteBookshelfList.innerHTML = "";
  completeBookshelfList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeBookshelfList.appendChild(bookElement);
    } else {
      incompleteBookshelfList.appendChild(bookElement);
    }
  });

  addBookEventListeners();
}

function createBookElement(book) {
  const article = document.createElement("article");
  article.classList.add("book_item");

  const h3 = document.createElement("h3");
  h3.textContent = book.title;
  article.appendChild(h3);

  const pAuthor = document.createElement("p");
  pAuthor.textContent = `Penulis: ${book.author}`;
  article.appendChild(pAuthor);

  const pYear = document.createElement("p");
  pYear.textContent = `Tahun: ${book.year}`;
  article.appendChild(pYear);

  const actionDiv = document.createElement("div");
  actionDiv.classList.add("action");

  const completeButton = document.createElement("button");
  completeButton.classList.add(book.isComplete ? "green" : "red");
  completeButton.textContent = book.isComplete
    ? "Belum selesai dibaca"
    : "Selesai dibaca";
  completeButton.addEventListener("click", function () {
    toggleBookCompletion(book.id);
    displayBooks();
  });
  actionDiv.appendChild(completeButton);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("red");
  deleteButton.textContent = "Hapus buku";
  deleteButton.addEventListener("click", function () {
    deleteBook(book.id);
    displayBooks();
  });
  actionDiv.appendChild(deleteButton);

  article.appendChild(actionDiv);

  return article;
}

function addBookEventListeners() {
  const bookItems = document.querySelectorAll(".book_item");

  bookItems.forEach((bookItem) => {
    const completeButton = bookItem.querySelector(".green");
    const deleteButton = bookItem.querySelector(".red");

    if (completeButton) {
      completeButton.addEventListener("click", function () {
        const bookId = parseInt(this.parentNode.parentNode.dataset.id);
        toggleBookCompletion(bookId);
        displayBooks();
      });
    }

    if (deleteButton) {
      deleteButton.addEventListener("click", function () {
        const bookId = parseInt(this.parentNode.parentNode.dataset.id);
        deleteBook(bookId);
        displayBooks();
      });
    }
  });
}

function loadBooksFromLocalStorage() {
  const storedBooks = localStorage.getItem("books");

  if (storedBooks) {
    try {
      books = JSON.parse(storedBooks);
    } catch (error) {
      console.error("Error parsing stored books:", error);
    }
  } else {
    books = [];
  }
}
function generateBookId() {
  return +new Date();
}
function saveBooksToLocalStorage() {
  const jsonData = JSON.stringify(books);

  localStorage.setItem("books", jsonData);
}
function deleteBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);

    saveBooksToLocalStorage();

    displayBooks();
  } else {
    console.warn(`Book with ID ${bookId} not found.`);
  }
}
function toggleBookCompletion(bookId) {
  const book = books.find((book) => book.id === bookId);

  if (book) {
    book.isComplete = !book.isComplete;

    saveBooksToLocalStorage();

    displayBooks();
  } else {
    console.warn(`Book with ID ${bookId} not found.`);
  }
}
