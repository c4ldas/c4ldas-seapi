/*
const seURL = 'https://api.streamelements.com/kappa'
const seScopes = 'channel:read activities:read activities:write overlays:read overlays:write tips:read tips:write loyalty:read loyalty:write bot:read bot:write'

// Getting the top watchtime on Streamelements leaderboard
// Usage: https://seapi.c4ldas.com.br/watchtime/c4ldas?amount=5
app.get('/watchtime/:username', async (req, res) => {

  const minutes = req.query.minutes || false
  const amount = req.query.amount;
  const accountId = await getAccountId(req.params.username);

  if (amount < 1 || amount > 100) {
    res.status(200).send(`Minimum amount: 1. Max amount: 100`)
    return
  }

  if (accountId.code == 404) {
    res.status(404).send(`Channel not found`)
    console.log('Account Id for that username not found')
    return
  }
  const topWatchtime = await getTopWatchtime(accountId, amount, minutes);
  console.log(`${new Date().toLocaleTimeString('en-UK')} - Channel: ${req.params.username} - Users: ${topWatchtime}`);
  res.status(200).send(`${topWatchtime}`)
})



// Get Account ID from username
async function getAccountId(username) {
  try {
    const accountIdRequest = await fetch(`${seURL}/v2/channels/${username}`, {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "applicadtion/json"
      }
    });
    const accountIdResponse = await accountIdRequest.json();
    const accountId = accountIdResponse._id;
    return accountId;

  } catch (error) {
    console.log('Error getting account ID: ', error)
    return { error: error.response.data.message, code: error.response.data.statusCode }
  }
}


// Get top watchtime users based on account ID
async function getTopWatchtime(accountId, amount = 1, minutes) {
  try {
    const topWatchtimeRequest = await fetch(`${seURL}/v2/points/${accountId}/watchtime?limit=${amount}&offset=0`, {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });
    const data = await topWatchtimeRequest.json();
    // console.log("Line 440:", data);
    const usersArray = data.users;
    const totalUsers = [];

    usersArray.forEach((element, index) => {
      if (minutes == 'true') {
        const convertedMinutes = calculateTime(element.minutes)
        totalUsers.push(`${index + 1}. ${element.username} (${convertedMinutes})`)
      } else {
        totalUsers.push(`${element.username}`)
      }
    })
    const topUsernames = totalUsers.join(',')
    return topUsernames

  } catch (error) {
    console.log(error);
    ////////////////////////////////////////////////////////////////////////////////////
    /////////// Check this error object ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    return { error: error.response.data.message, code: error.response.data.statusCode }
  }
}

// Convert minutes in days, hours and minutes
function calculateTime(minutes) {
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const remainingMinutes = minutes % 60;

  let result = '';
  if (days > 0) {
    result += `${days}d`;
  }
  if (hours > 0) {
    if (result !== '') {
      result += ', ';
    }
    result += `${hours}h`;
  }
  if (remainingMinutes > 0) {
    if (result !== '') {
      result += ', ';
    }
    result += `${remainingMinutes}m`;
  }
  return result;
}

*/
