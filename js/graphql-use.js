const yearSelect = document.getElementById("year");
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= 1900; year--) {
  const option = document.createElement("option");
  option.value = year;
  option.textContent = year;
  yearSelect.appendChild(option);
}

const apiUrl = 'https://berdnykbookstore.netlify.app/graphql';

async function fetchBooks() {
  const query = `
    query {
      books {
        _id
        title
        author
        rating
        year
      }
    }
  `;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    const json = await res.json();

    if (json.errors) {
      console.error('Error fetching books:', json.errors);
      return;
    }

    const books = json.data.books;
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
            `;

            tableBody.appendChild(row);
        });
  } catch (error) {
    console.error('Error in fetchBooks:', error);
  }
}

document.getElementById('book-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const rating = parseInt(document.getElementById('rating').value, 10);
  const year = parseInt(document.getElementById('year').value, 10);

  const mutation = `
    mutation CreateBook($title: String!, $author: String!, $rating: Int!, $year: Int!) {
      createBook(title: $title, author: $author, rating: $rating, year: $year) {
        _id
        title
        author
        rating
        year
      }
    }
  `;

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: mutation,
        variables: { title, author, rating, year }
      })
    });

    const json = await res.json();

    if (json.errors) {
      console.error('Error creating book:', json.errors);
      return;
    }

    e.target.reset();
    fetchBooks();
  } catch (error) {
    console.error('Error in submit handler:', error);
  }
});

fetchBooks();
