const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');

const PORT = process.env.PORT || 9900;

const MONGO_URL = 'mongodb+srv://nasa_api:uhKw2f2ptKRqBZd@cluster0.lrp5d.mongodb.net/nasa?retryWrites=true&w=majority';

const server = http.createServer(app);

mongoose.connection.once("open", async () => {
  await loadPlanetsData();
  startServer();
  console.log("connected to mongodb");
})

mongoose.connection.on("error", (err) => {
  console.error("error connected to mongodb :", err);
})

function startServer() {
  server.listen(PORT, () => {
    console.log(PORT);
  });
}

function connectMongo() {
  mongoose.connect(MONGO_URL);
}

connectMongo();