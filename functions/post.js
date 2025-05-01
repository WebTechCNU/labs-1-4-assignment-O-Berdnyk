require("dotenv").config();
const jwt = require("jsonwebtoken");
const connectDB = require("./db");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
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
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: JSON.stringify({ message: "Метод не дозволений" }),
    };
  }

  const token = event.headers.authorization?.split(" ")[1];
  const secretKey = process.env.JWT_SECRET || "secret-key";

  if (!token) {
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: JSON.stringify({ error: "Unauthorized: No token provided" }),
    };
  }

  try {
    jwt.verify(token, secretKey);
  } catch (error) {
    return {
      statusCode: 403,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: JSON.stringify({ error: "Forbidden: Invalid token" }),
    };
  }

  try {
    const { title, author, rating, year } = JSON.parse(event.body);

    if (!title || !author || rating === undefined || !year) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        body: JSON.stringify({ message: "Всі поля обов'язкові!" }),
      };
    }

    const collection = await connectDB();
    const lastBook = await collection.find().sort({ _id: -1 }).limit(1).toArray();
    const newId = lastBook.length > 0 ? lastBook[0]._id + 1 : 1;

    const newBook = { _id: newId, title, author, rating: Number(rating), year: Number(year) };

    const result = await collection.insertOne(newBook);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
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
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: JSON.stringify({ message: "Помилка при додаванні книги", error: error.message }),
    };
  }
};
