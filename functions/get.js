require("dotenv").config();
const connectDB = require("./db");

exports.handler = async () => {
  try {
    const collection = await connectDB(); 
    const books = await collection.find().toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(books),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Помилка отримання книг", error: error.message }),
    };
  }
};
