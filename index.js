
require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();

const port = process.env.PORT;
const client = new MongoClient(process.env.MONGODB_URI);


async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('You successfully connected to MongoDB!');
    return client;
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    throw err;
  }
}

async function disconnectFromMongoDB() {
  await client.close();
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});


async function startServer() {
  try {
    await connectToMongoDB();

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

startServer();
