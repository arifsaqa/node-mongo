const http = require('http');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { connectMongo } = require('./services/mongo');

const PORT = process.env.PORT || 9900;

const server = http.createServer(app);

async function startServer() {
  await connectMongo();
  await loadPlanetsData();
  server.listen(PORT, () => {
    console.log(PORT);
  });
}

startServer();