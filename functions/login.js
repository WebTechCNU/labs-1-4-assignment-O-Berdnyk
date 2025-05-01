const jwt = require("jsonwebtoken");
const connectDB = require("./db");

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    if (!username || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Необхідно вказати логін і пароль" }),
      };
    }

    const db = await connectDB("users");
    const user = await db.findOne({ username });

    if (!user || user.password !== password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Невірні облікові дані" }),
      };
    }

    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ token }),
    };
  } catch (err) {
    console.error("Помилка входу:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Помилка сервера" }),
    };
  }
};
