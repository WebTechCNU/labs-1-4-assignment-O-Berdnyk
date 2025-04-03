require("dotenv").config();
const connectDB = require("./db");

exports.handler = async (event) => {
    if (event.httpMethod !== "PUT") {
      return {
        statusCode: 405,
        body: JSON.stringify({ message: "Метод не дозволений" }),
      };
    }
  
    try {
      const { id, title, author, rating, year } = JSON.parse(event.body);
  
      if (!id || !title || !author || rating === undefined || !year) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Всі поля обов'язкові!" }),
        };
      }
  
      const collection = await connectDB();
      const result = await collection.updateOne(
        { id: Number(id) },
        { $set: { title, author, rating: Number(rating), year } }
      );
  
      if (result.modifiedCount === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Книга не знайдена" }),
        };
      }
  
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Книга успішно оновлена" }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Помилка при оновленні книги", error: error.message }),
      };
    }
  };
