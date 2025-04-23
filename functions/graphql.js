const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");
const serverless = require("serverless-http");
const connectDB = require("./db");
const { string } = require("mongodb");

const typeDefs = gql`
  type Item {
    _id: Int!
    title: String!
    author: String!
    rating: Int!
    year: Int!
  }

  type Query {
    items(skip: Int, take: Int, sortField: String, sortOrder: String): [Item]
    item(id: Int!): Item
  }

  type Mutation {
    createItem(title: String!, author: String!, rating: Int!, year: Int!): Item
    updateItem(id: Int!, title: String, author: String, rating: Int, year: Int): Item
    deleteItem(id: Int!): Boolean
  }
`;


const resolvers = {
  Query: {
    items: async (_, { skip = 0, take = 10, sortField = "title", sortOrder = "asc" }) => {
      const collection = await connectDB();
      const sort = { [sortField]: sortOrder === "desc" ? -1 : 1 };
      return await collection.find({}).sort(sort).skip(skip).limit(take).toArray();
    },
    item: async (_, { id }) => {
      const collection = await connectDB();
      return await collection.findOne({ _id: id });
    },
  },
  Mutation: {
    createItem: async (_, { title, author, rating, year }) => {
      const collection = await connectDB();

      // Знайти найбільший _id, щоб зробити автоінкремент
      const lastItem = await collection.find().sort({ _id: -1 }).limit(1).toArray();
      const newId = lastItem.length > 0 ? lastItem[0]._id + 1 : 1;

      const newItem = { _id: newId, title, author, rating, year };
      await collection.insertOne(newItem);
      return newItem;
    },
    updateItem: async (_, { id, title, author, rating, year }) => {
      const collection = await connectDB();
      const updateFields = {};
      if (title !== undefined) updateFields.title = title;
      if (author !== undefined) updateFields.author = author;
      if (rating !== undefined) updateFields.rating = rating;
      if (year !== undefined) updateFields.year = year;

      await collection.updateOne({ _id: id }, { $set: updateFields });
      return { _id: id, ...updateFields };
    },
    deleteItem: async (_, { id }) => {
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
  context: ({ event, context }) => ({ event, context }),
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer();

exports.handler = serverless(app);


