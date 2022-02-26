const mongoose = require('mongoose');

require('dotenv').config()

const MONGO_URL_ENV = process.env.MONGO_URL;

mongoose.connection.once("open", async () => {
  console.log("connected to mongodb");
})

mongoose.connection.on("error", (err) => {
  console.error("error connected to mongodb :", err);
})

async function connectMongo() {
  // console.log(process.env)
  await mongoose.connect(MONGO_URL_ENV??"");
}

async function disconnectMongo() {
  await mongoose.disconnect();
}

module.exports = {
  connectMongo,
  disconnectMongo
}