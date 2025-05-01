document.addEventListener("DOMContentLoaded", fetchBooks);

function fetchBooks() {
  fetch("/api/books")
    .then(response => response.json())
    .then(books => {
      const tableBody = document.getElementById("booksTable");
      tableBody.innerHTML = "";

      books.forEach(book => {
        const row = document.createElement("tr");

        row.innerHTML = `
                <td>${book._id}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.rating}</td>
                <td>
                    <button class="edit-btn" onclick="editBook('${book._id}', '${book.title}', '${book.author}', ${book.rating}, ${book.year})">✏ Редагувати</button>
                    <button class="delete-btn" onclick="deleteBook(${book._id})">🗑 Видалити</button>
                </td>
            `;

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Помилка отримання книг:", error));
}

async function deleteBook(bookId) {
  const token = localStorage.getItem("token");
  
  if (!token) {
    alert("Будь ласка, увійдіть в систему, щоб видалити книгу.");
    window.location.href = "/login.html";
    return;
  }

  const confirmDelete = window.confirm(`Ви точно хочете видалити книгу з ID ${bookId}?`);
  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`/api/books/delete?id=${bookId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data.message);
    fetchBooks();
  } catch (error) {
    console.error("Помилка при видаленні книги:", error);
  }
}

function editBook(id, title, author, rating, year) {
  localStorage.setItem('editBook', JSON.stringify({ id, title, author, rating, year }));
  window.location.href = '/edit-book.html';
}
