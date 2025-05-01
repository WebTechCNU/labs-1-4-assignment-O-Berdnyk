window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Будь ласка, увійдіть в систему, щоб додати книгу.");
    window.location.href = "/login.html";
    return;
  }
});

const yearSelect = document.getElementById("year");
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= 1900; year--) {
  const option = document.createElement("option");
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
}

async function addBook(event) {
    event.preventDefault();
  
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const rating = document.getElementById("rating").value;
    const year = document.getElementById("year").value;

    if (!title || !author || rating === "" || !year) {
        alert("Заповніть всі поля!");
        return;
    }
  
    const newBook = { title, author, rating: Number(rating), year: Number(year) };
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("/api/books/add", {
        method: "POST",
        headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
        body: JSON.stringify(newBook),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Книга успішно додана");
        console.log(data.message);
        document.getElementById("book-form").reset();
      } else {
        alert("Помилка: " + data.message);
      }
    } catch (error) {
      console.error("Помилка додавання книги:", error);
      alert("Сталася помилка при додаванні книги.");
    }
  }
  