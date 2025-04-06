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

  try {
    const collection = await connectDB();
    const books = await collection.find().toArray();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      },
      body: JSON.stringify(books),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Помилка отримання книг", error: error.message }),
    };
  }
};
