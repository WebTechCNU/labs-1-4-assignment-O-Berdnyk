require("dotenv").config();
const connectDB = require("./db");

exports.handler = async (event, context) => {
    const bookId = parseInt(event.queryStringParameters.id); 
  
    if (!bookId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Відсутній параметр id" }),
      };
    }
  
    try {
      const collection = await connectDB();
  
      const result = await collection.deleteOne({ _id: bookId });
  
      if (result.deletedCount === 1) {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: `Книгу з _id ${bookId} успішно видалено.` }),
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: `Книга з _id ${bookId} не знайдена.` }),
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Помилка при видаленні книги", error: error.message }),
      };
    }
  };
  