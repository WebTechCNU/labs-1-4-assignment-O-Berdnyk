const yearSelect = document.getElementById("year");
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= 1900; year--) {
  const option = document.createElement("option");
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
}

window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Будь ласка, увійдіть в систему, щоб редагувати книгу.");
    window.location.href = "/login.html";
    return;
  }
  
  const bookData = JSON.parse(localStorage.getItem('editBook'));

  if (bookData) {
    document.getElementById('title').value = bookData.title;
    document.getElementById('author').value = bookData.author;
    document.getElementById('rating').value = bookData.rating;
    document.getElementById('year').value = bookData.year;

    document.getElementById('edit-form').onsubmit = async function (event) {
      event.preventDefault();

      const updatedBook = {
        id: Number(bookData.id),
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        rating: Number(document.getElementById('rating').value),
        year: Number(document.getElementById('year').value),
      };

      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`/api/books/edit`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedBook),
        });

        const result = await response.json();

        console.log(result);
        if (response.ok) {
          alert("Книга успішно оновлена!");
          window.location.href = '/';
        } else {
          alert("Помилка при оновленні книги: " + result.message);
        }
      } catch (error) {
        console.error("Помилка оновлення книги:", error);
        alert("Сталася помилка при оновленні книги.");
      }
    };
  } else {
    alert("Дані книги не знайдені!");
    window.location.href = '/';
  }
});
