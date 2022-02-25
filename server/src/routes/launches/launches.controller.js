const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLauchWithId
} = require('../../models/launches.model')

async function httpGetAllLaunches(req, res) {
  res.status(200).json(await getAllLaunches())
}

async function httpAddNewLaunch(req, res) {
  const launch = req.body;
  if (
    !launch.launchDate ||
    !launch.mission ||
    !launch.rocket ||
    !launch.target) {
    return res.status(400).json({
      error: 'Missing required launch property',
    });
  }
  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: 'Invalid launch date'
    })
  }
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
  const laucnhId = Number(req.params.id);
  if (!existsLaunchWithId(laucnhId)) {
    res.status(404).json({
      error: "Lauch not found",
    })
  } else {
    const aborted = abortLauchWithId(laucnhId);
    res.status(200).json(aborted);
  }

}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch, 
}