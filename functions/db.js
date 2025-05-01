const { MongoClient } = require("mongodb");
const client = new MongoClient(process.env.MONGO_URI);
let collectionName = "books";
let db;

async function connectDB(collection = collectionName) {
  if (!db) {
    await client.connect();
    db = client.db(process.env.DB_NAME);
  }
  return db.collection(collection);
}

module.exports = connectDB;
