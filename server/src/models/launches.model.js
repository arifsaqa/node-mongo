const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 20, 2030'),
  target: 'Kepler-440 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true
}

saveLaunch(launch)

function existsLaunchWithId(laucnhId) {
  return launches.has(laucnhId);
}

async function getAllLaunches() {
  return launches
    .find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  try {
    const planet = await planets.findOne({
      keplerName: launch.target
    });
    if (!planet) {
      throw new Error("No matching planet found");
    }
    await launches.updateOne({
      flightNumber: launch.flightNumber
    }, launch, {
      upsert: true
    });
  } catch (error) {
    console.error(`Could not save lunch ${error}`);
  }
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches
    .findOne()
    .sort('-flightNumber');
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
    flightNumber: newFlightNumber
  });
  await saveLaunch(newLaunch);
}


function abortLauchWithId(laucnhId) {
  const aborted = launches.get(laucnhId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLauchWithId,
}