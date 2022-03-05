const http = require('http');
const app = require('./app');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const { connectMongo } = require('./services/mongo');

const PORT = process.env.PORT || 9900;

const server = http.createServer(app);

async function startServer() {
  await connectMongo();
  await loadPlanetsData();
  await loadLaunchesData();
  server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
}

startServer();