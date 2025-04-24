const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const serverless = require("serverless-http");
const connectDB = require("./db");

const typeDefs = gql`
  type Book {
    _id: Int!
    title: String!
    author: String!
    rating: Int!
    year: Int!
  }

  type Query {
    books(skip: Int, take: Int, sortField: String, sortOrder: String): [Book]
    book(id: Int!): Book
  }

  type Mutation {
    createBook(title: String!, author: String!, rating: Int!, year: Int!): Book
    updateBook(id: Int!, title: String, author: String, rating: Int, year: Int): Book
    deleteBook(id: Int!): Boolean
  }
`;

const resolvers = {
  Query: {
    books: async (_, { skip = 0, take = 10, sortField = "title", sortOrder = "asc" }) => {
      const collection = await connectDB();
      const sort = sortField ? { [sortField]: sortOrder === "desc" ? -1 : 1 } : {};
      return await collection.find().sort(sort).skip(skip).limit(take).toArray();
    },
    book: async (_, { id }) => {
      const collection = await connectDB();
      return await collection.findOne({ _id: id });
    },
  },

  Mutation: {
    createBook: async (_, { title, author, rating, year }) => {
      const collection = await connectDB();
      const lastBook = await collection.find().sort({ _id: -1 }).limit(1).toArray();
      const newId = lastBook.length > 0 ? lastBook[0]._id + 1 : 1;

      const newBook = { _id: newId, title, author, rating, year };
      await collection.insertOne(newBook);
      return newBook;
    },

    updateBook: async (_, { id, title, author, rating, year }) => {
      const collection = await connectDB();
      const updateFields = {};
      if (title !== undefined) updateFields.title = title;
      if (author !== undefined) updateFields.author = author;
      if (rating !== undefined) updateFields.rating = rating;
      if (year !== undefined) updateFields.year = year;

      await collection.updateOne({ _id: id }, { $set: updateFields });
      return { _id: id, ...updateFields };
    },

    deleteBook: async (_, { id }) => {
      const collection = await connectDB();
      const result = await collection.deleteOne({ _id: id });
      return result.deletedCount > 0;
    },
  },
};

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ event }) => ({ event }),
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer();

exports.handler = serverless(app);