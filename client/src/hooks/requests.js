const BASE_URL = 'v1';

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${BASE_URL}/planets`);
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${BASE_URL}/launches`);
  const launches = await response.json();
  return launches.sort((a,b)=> a.flightNumber - b.flightNumber)
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  try {
    return await fetch(`${BASE_URL}/launches`, {
      method: "POST",
      headers: {
        'Content-Type':'application/json'
      },
      body:JSON.stringify(launch)
    });

  } catch (error) {
    return {
      ok:false
    };
  }
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${BASE_URL}/launches/${id}`, {
      method: "DELETE"
    });
  } catch (error) {
    return {
      response: false
    };
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};