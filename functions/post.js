require("dotenv").config();
const connectDB = require("./db");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: "",
    };
  }
  
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ message: "Метод не дозволений" }),
    };
  }

  try {
    const { title, author, rating, year } = JSON.parse(event.body);

    if (!title || !author || rating === undefined || !year) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*", 
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        },
        body: JSON.stringify({ message: "Всі поля обов'язкові!" }),
      };
    }

    const collection = await connectDB(); 
    const lastBook = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const newId = lastBook.length > 0 ? lastBook[0].id + 1 : 1;

    const newBook = { _id: newId, title, author, rating: Number(rating), year: Number(year) };

    const result = await collection.insertOne(newBook);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({
        message: "Книга успішно додана!",
        book: { id: result.insertedId, ...newBook },
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify({ message: "Помилка при додаванні книги", error: error.message }),
    };
  }
};
