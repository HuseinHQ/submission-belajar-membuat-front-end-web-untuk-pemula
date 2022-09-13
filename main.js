const storageKey = 'books_list';
const savedEvent = 'saved_books';
const renderEvent = 'render-book';
const books = [];

function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Your browser isn\'t support local storage');
    return false;
  }
  return true;
}

document.addEventListener(savedEvent, function () {
  console.log(localStorage.getItem(storageKey));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(storageKey);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(renderEvent));
}

document.addEventListener('DOMContentLoaded', function () {
  // ...
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const inputBook = document.getElementById('inputBook');
  inputBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    alert('input');
  });
});

function generateId() {
  return +new Date();
}

function generateBookObject(id, judul, penulis, tahun, isComplete) {
  return {
    id,
    judul,
    penulis,
    tahun,
    isComplete
  }
}

function addBook() {
  const generatedId = generateId();
  const judul = document.getElementById('inputBookTitle').value;
  const penulis = document.getElementById('inputBookAuthor').value;
  const tahun = document.getElementById('inputBookYear').value;
  const isComplete = document.getElementById('inputBookIsComplete').checked;
  
  const bookObject = generateBookObject(generatedId, judul, penulis, tahun, isComplete);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(renderEvent));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.judul === bookId) {
      console.log(bookItem);
      return bookItem;
    }
  }
  return null;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(storageKey, parsed);
    document.dispatchEvent(new Event(savedEvent));
  }
}

function addUnreadBook(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(renderEvent));
  saveData();
}

function addReadBook(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(renderEvent));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }

  return -1;
}

function deleteBook(bookId) {
  window.confirm('Yakin ingin menghapus buku?');
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(renderEvent));
  saveData();
}

function switchBookFromRead(bookItem) {
  bookItem.isComplete = false;
  document.dispatchEvent(new Event(renderEvent));
  saveData();
}

function switchBookFromUnread(bookItem) {
  bookItem.isComplete = true;
  document.dispatchEvent(new Event(renderEvent));
  saveData();
}

function makeBook(bookObject) {
  // const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  // const completeBookshelfList = document.getElementById('completeBookshelfList');

  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.judul;
 
  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = 'Penulis: ' + bookObject.penulis;

  const bookYear = document.createElement('p');
  bookYear.innerText = 'Tahun: ' + bookObject.tahun;
 
  const textContainer = document.createElement('article');
  textContainer.classList.add('book_item');
  textContainer.append(bookTitle, bookAuthor, bookYear);
 
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('action');
  textContainer.append(buttonContainer);

  if (bookObject.isComplete) {
    const incompleteButton = document.createElement('button');
    incompleteButton.classList.add('green');
    incompleteButton.innerText = 'Belum selesai dibaca';
 
    incompleteButton.addEventListener('click', function () {
      console.log(bookObject);
      switchBookFromRead(bookObject);
      alert('switch');
    });
 
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus Buku';
 
    deleteButton.addEventListener('click', function () {
      deleteBook(bookObject.id);
      alert('delete');
    });
 
    buttonContainer.append(incompleteButton, deleteButton);
  } else {
    const completeButton = document.createElement('button');
    completeButton.classList.add('green');
    completeButton.innerText = 'Selesai dibaca';
 
    completeButton.addEventListener('click', function () {
      console.log(bookObject);
      switchBookFromUnread(bookObject);
      alert('switch');
    });
 
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('red');
    deleteButton.innerText = 'Hapus Buku';
 
    deleteButton.addEventListener('click', function () {
      deleteBook(bookObject.id);
      alert('delete');
    });
 
    buttonContainer.append(completeButton, deleteButton);
  }

  return textContainer;
}

const switchButton = document.getElementsByClassName('green');

// switchButton.addEventListener('click', function(){
//   const button = document.getElementsByClassName('green').value;
//   if(button == 'Selesai dibaca'){
//     books.isComplete = false;
//   } else {
//     books.isComplete = true;
//   }
// })


document.addEventListener(renderEvent, function () {
  const unreadBookList = document.getElementById('incompleteBookshelfList');
  unreadBookList.innerHTML = '';

  const readBookList = document.getElementById('completeBookshelfList');
  readBookList.innerHTML = '';
 
  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete == false) {
      unreadBookList.append(bookElement);
    } else {
      readBookList.append(bookElement);
    }
  }
});

const isCompleteCheck = document.getElementById('inputBookIsComplete'); 

isCompleteCheck.addEventListener('click', function(event){
  const inputButton = document.getElementsByTagName('span')[0];
  console.log(inputButton);
  const isCheck = document.getElementById('inputBookIsComplete').checked;
   console.log(isCheck);
  if(isCheck == true){
    inputButton.innerText = 'Selesai dibaca';
  } else if (isCheck == false){
    inputButton.innerText = 'Belum selesai dibaca';
  }
});

function searchBook(){
  const searchedBook = document.getElementById('searchBookTitle').value;
  const upperCasedSearch = searchedBook.toUpperCase();
  let flag = 0;
  // return a.includes('are');

  for(const bookItem of books){
    let upperCasedTitle = bookItem.judul.toUpperCase();
    if(searchedBook == ''){
      return '';
    } else if(upperCasedTitle.includes(upperCasedSearch)) {
      console.log('buku ditemukan');

      const bookTitle = document.createElement('h3');
      bookTitle.innerText = bookItem.judul;
     
      const bookAuthor = document.createElement('p');
      bookAuthor.innerText = 'Penulis: ' + bookItem.penulis;
    
      const bookYear = document.createElement('p');
      bookYear.innerText = 'Tahun: ' + bookItem.tahun;

      const textContainer = document.createElement('article');
      textContainer.classList.add('book_item');
      textContainer.append(bookTitle, bookAuthor, bookYear);

      // const bookContainer = document.createElement('div');
      // bookContainer.setAttribute('id', 'searchedBookshelfList');
      // bookContainer.classList.add('book_list');
      // bookContainer.append(textContainer);

      // const sectionTitle = document.createElement('h2');
      // sectionTitle.innerText = 'Hasil Pencarian Buku';

      // const section = document.createElement('section');
      // section.classList.add('book_shelf');
      // section.append(sectionTitle, bookContainer);

      return textContainer;
    } else {
      flag = 1;
    }
  }
  if(flag == 1){
    console.log('maaf bu tidak ditemukan');
  }
}

const search = document.getElementById('searchSubmit');

search.addEventListener('click', function(event){
  event.preventDefault();
  const bookElement = searchBook();
  const notFound = document.createElement('h3');

  const searchedBookList = document.getElementById('searchedBookshelfList');
  searchedBookList.innerHTML = '';
  console.log(bookElement);
  if(bookElement == undefined){
    notFound.innerText = 'Buku tidak ditemukan';
    searchedBookList.append(notFound);
  } else {
  searchedBookList.append(bookElement);
  }
});

function alert(input){
  const message = document.getElementById('alert');
  message.innerText = '';
  if(input == 'input'){
    message.innerText = 'Buku berhasil dimasukkan!';
  } else if (input == 'switch'){
    message.innerText = 'Buku berhasil dipindahkan!';
  } else if(input == 'delete'){
    message.innerText = 'Buku berhasil dihapus!'
  }

  message.removeAttribute('style');

  setTimeout(() => {
    message.setAttribute('style', 'display: none');
  }, 3000); //miliseconds
}