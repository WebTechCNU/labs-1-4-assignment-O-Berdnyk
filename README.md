[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Om1zqYVh)
# Book Reading Tracker

This is an application for keeping track of read books. It allows users to add, edit, view, and delete books, storing information such as the title, author, publication year, and the rating the user gave to the book. This allows you to share a link to the site with your friends so they can explore what you've read and the ratings you’ve given to each book. It's useful if your friends want to find something to read for themselves or buy you a book as a gift that you haven't read yet.

## How to Run Locally

1. Clone the repository.
2. Install Node.js and Netlify CLI.
3. Open a command line in the folder where you cloned the repository.
4. Run the command:
   ```bash
   netlify dev
   ```

Once the server is running, go to the following link in your browser:
http://localhost:8888/
Or directly: http://localhost:8888/index.html

## REST API
- `GET /api/books`  
  Retrieve the list of all books.

- `POST /api/books/add`  
  Add a new book to the database

- `PUT /api/books/edit`  
  Update information about an existing book by its `Id`.

- `DELETE /api/books/delete`  
  Delete a book from the database by its `Id`.

## Possible Improvements
- Add the ability to delete, edit, and modify book records only for authorized users.
- Add a user table in the database and associate book records with individual users.

In the future, this could become a platform where multiple users can maintain their own reading lists and share them with other