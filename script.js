document.addEventListener("DOMContentLoaded", function () {
  const addButton = document.querySelector(".btn");
  addButton.addEventListener("click", function (e) {
    e.preventDefault();
    addBook();
  });

  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete")) {
      // Call confirmDelete function for "delete" button click
      confirmDelete(e.target.parentElement);
    } else if (e.target.classList.contains("read")) {
      markAsRead(e.target.parentElement);
    }
  });

  // Load books when the page is loaded
  loadBooks();
});

function loadBooks() {
  const unreadgroup = document.querySelector(".books_unread");
  const readgroup = document.querySelector(".books_read");

  // Load books from localStorage
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books.forEach((book) => {
    const group = createBookElement(book);
    if (book.isComplete) {
      readgroup.appendChild(group);
    } else {
      unreadgroup.appendChild(group);
    }
  });
}

function generateRandomId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function createBookElement(book) {
  const group = document.createElement("div");
  group.classList.add("group_book");
  group.dataset.id = book.id;

  const bookTitleElement = document.createElement("h2");
  bookTitleElement.innerHTML = book.title;

  const bookAuthorElement = document.createElement("p");
  bookAuthorElement.innerHTML = book.author;

  const bookYearElement = document.createElement("p");
  bookYearElement.innerHTML = book.year;

  const buttonDelete = document.createElement("button");
  buttonDelete.classList.add("delete");
  buttonDelete.innerHTML = "Delete";

  const buttonRead = document.createElement("button");
  buttonRead.classList.add("read");
  buttonRead.innerHTML = "Read";

  group.appendChild(bookTitleElement);
  group.appendChild(bookAuthorElement);
  group.appendChild(bookYearElement);
  group.appendChild(buttonDelete);
  group.appendChild(buttonRead);

  return group;
}

function addBook() {
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");
  const yearInput = document.getElementById("year");
  const checkboxInput = document.getElementById("sudahBaca");

  const title = titleInput.value;
  const author = authorInput.value;
  const year = parseInt(yearInput.value);
  const isComplete = checkboxInput.checked;

  // Validate input
  if (!title || !author || isNaN(year)) {
    Swal.fire("Isi semua form dengan benar sebelum menambahkan buku.");
    return;
  }

  const book = {
    id: generateRandomId(),
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  const unreadgroup = document.querySelector(".books_unread");
  const readgroup = document.querySelector(".books_read");
  const group = createBookElement(book);

  if (isComplete) {
    readgroup.appendChild(group);
  } else {
    unreadgroup.appendChild(group);
  }

  saveBookToStorage(book);
  Swal.fire("Buku berhasil ditambahkan!", "", "success");

  titleInput.value = "";
  authorInput.value = "";
  yearInput.value = "";
  checkboxInput.checked = false;
}
function confirmDelete(groupElement) {
  Swal.fire({
    title: "Apakah Anda yakin?",
    text: "Anda tidak dapat mengembalikan buku setelah dihapus!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Hapus",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteBook(groupElement);
      Swal.fire("Buku berhasil dihapus!", "", "success");
    }
  });
}

function deleteBook(groupElement) {
  // Remove the book from the view
  groupElement.remove();
  // Remove the book from localStorage
  removeBookFromStorage(groupElement.dataset.id);
}

function markAsRead(groupElement) {
  // Move the book to the "Read" section
  const readgroup = document.querySelector(".books_read");
  readgroup.appendChild(groupElement);

  // Update the book status in localStorage
  updateBookStatusInStorage(groupElement.dataset.id, true);
}

function saveBookToStorage(book) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books.push(book);
  localStorage.setItem("books", JSON.stringify(books));
}

function removeBookFromStorage(bookId) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books = books.filter((book) => book.id !== bookId);
  localStorage.setItem("books", JSON.stringify(books));
}

function updateBookStatusInStorage(bookId, isComplete) {
  let books = JSON.parse(localStorage.getItem("books")) || [];
  books.forEach((book) => {
    if (book.id === bookId) {
      book.isComplete = isComplete;
    }
  });
  localStorage.setItem("books", JSON.stringify(books));
}
