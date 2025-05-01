const jwt = require("jsonwebtoken");
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT,DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
  const { username, password } = JSON.parse(event.body);

  console.log("username = " + username);
  console.log("password = " + password);

  console.log("Correct username = " + process.env.username);
  console.log("Correct password = " + process.env.password);
  if (username !== process.env.USERNAME || password !==
    process.env.PASSWORD) {
    return {
      statusCode: 401, body: JSON.stringify({
        error:
          "Invalid credentials"
      })
    };
  }
  const secretKey = process.env.JWT_SECRET;
  const token = jwt.sign({ username }, secretKey, {
    expiresIn:
      "1h"
  });
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT,DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    },
    body: JSON.stringify({ token }),
  };
};
