const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: 'Kepler Exploration X',//name
  rocket: 'Explorer IS1', //rocket.name
  launchDate: new Date('December 20, 2030'),//date_local
  target: 'Kepler-440 b',//not applicable
  customers: ['ZTM', 'NASA'],//payloads.customerss each payload
  upcoming: true,//upcoming
  success: true//success
}

saveLaunch(launch)

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
  console.log('downloading data . . .');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: "payloads",
          select: {
            'customers': 1
          }
        }
      ]
    }
  
  });
  if (response.status !== 200) {
    console.log('problem downloading data');
    throw new Error('Launch data downloaded error');
  }
  
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });
    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers
    };
    console.log(`${launch.flightNumber} ${launch.mission} [${launch.customers}]`)
    await saveLaunch(launch);
  }
}
async function findLaunch(filter) {
  return await launches.findOne(filter);
}
async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Launch data already loaded!');
  } else {
    await populateLaunches();
  }
}

async function existsLaunchWithId(laucnhId) {
  return await launches.findOne({
    flightNumber: laucnhId
  });
}

async function getAllLaunches(skip, limit) {
  return await launches
    .find({}, { _id: 0, __v: 0 })
    .sort({flightNumber: 1})
    .skip(skip)
    .limit(limit)
    ;
}

async function saveLaunch(launch) {
  try {
    await launches.findOneAndUpdate({
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
    .sort('flightNumber');
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  });
  if (!planet) {
    throw new Error("No matching planet found");
  }
  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
    flightNumber: newFlightNumber
  });
  await saveLaunch(newLaunch);
}

async function abortLauchById(laucnhId) {
  const aborted = await launches.updateOne({
    flightNumber: laucnhId
  }, {
    upcoming: false,
    success: false,
  });

  return aborted.acknowledged && aborted.modifiedCount == 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLauchById,
  loadLaunchesData
}