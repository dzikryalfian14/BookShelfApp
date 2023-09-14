document.addEventListener("DOMContentLoaded", function () {
  const bookSubmitForm = document.getElementById("inputBook");
  const searchSubmitForm = document.getElementById("searchBook");
  const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
  const completeBookshelfList = document.getElementById("completeBookshelfList");

  // mengambil data buku dari Local Storage 
  let books = JSON.parse(localStorage.getItem("books")) || [];

  //menyimpan data buku ke Local Storage
  function updateLocalStorage() {
    localStorage.setItem("books", JSON.stringify(books));
  }

  // merender tampilan buku
  function renderBook(book, targetList, isComplete) {
    const bookItem = document.createElement("article");
    bookItem.classList.add("book_item");
    bookItem.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      <p>Tahun: ${book.year}</p>
      <button class="btn_move ${isComplete ? "btn_complete" : "btn_incomplete"}" data-id="${book.id}" data-complete="${isComplete}">${isComplete ? "Belum Selesai" : "Selesai"} dibaca</button>
      <button class="btn_delete" data-id="${book.id}">Hapus</button>
    `;
    targetList.appendChild(bookItem);
  }

  // merefresh tampilan rak
  function refreshBookshelf() {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    // Memisahkan buku-buku sesuai dengan status isComplete
    books.forEach((book) => {
      if (book.isComplete) {
        renderBook(book, completeBookshelfList, true);
      } else {
        renderBook(book, incompleteBookshelfList, false);
      }
    });

    // tombol Pindahkan dan Hapus
    const moveButtons = document.querySelectorAll(".btn_move");
    const deleteButtons = document.querySelectorAll(".btn_delete");

    moveButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const bookId = button.getAttribute("data-id");
        const bookIndex = books.findIndex((book) => book.id == bookId);
        books[bookIndex].isComplete = !books[bookIndex].isComplete;
        updateLocalStorage();
        refreshBookshelf();
      });
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const bookId = button.getAttribute("data-id");
        const bookIndex = books.findIndex((book) => book.id == bookId);

        // Menggunakan notifikasi dari sweetalert
        Swal.fire({
          title: 'Hapus Buku?',
          text: 'Anda yakin ingin menghapus buku ini?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus',
          cancelButtonText: 'Batal'
        }).then((result) => {
          if (result.isConfirmed) {
            // Menghapus buku dari array dan Local Storage
            books.splice(bookIndex, 1);
            updateLocalStorage();
            refreshBookshelf();
            // Menampilkan notifikasi penghapusan buku berhasil
            Swal.fire(
              'Terhapus!',
              'Buku telah dihapus.',
              'success'
            );
          }
        });
      });
    });
  }

  //form penambahan buku
  bookSubmitForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Mengambil nilai dari input form
  const inputBookTitle = document.getElementById("inputBookTitle").value;
  const inputBookAuthor = document.getElementById("inputBookAuthor").value;
  const inputBookYear = parseInt(document.getElementById("inputBookYear").value); 
  const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    //objek buku baru
    const newBook = {
      id: +new Date(),
      title: inputBookTitle,
      author: inputBookAuthor,
      year: inputBookYear,
      isComplete: inputBookIsComplete,
    };

    // buku baru ke dalam Local Storage
    books.push(newBook);
    updateLocalStorage();
    bookSubmitForm.reset();
    refreshBookshelf();
});


  // pencarian buku
  searchSubmitForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Mengambil nilai judul buku yang dicari
    const searchBookTitle = document.getElementById("searchBookTitle").value.toLowerCase();

    // Mencari buku berdasarkan judul
    const searchResults = books.filter((book) => book.title.toLowerCase().includes(searchBookTitle));

    // Mengosongkan tampilan rak buku sebelum merender hasil pencarian
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    //hasil pencarian
    searchResults.forEach((book) => {
      if (book.isComplete) {
        renderBook(book, completeBookshelfList, true);
      } else {
        renderBook(book, incompleteBookshelfList, false);
      }
    });
  });

  // Me-refresh tampilan rak
  refreshBookshelf();
});