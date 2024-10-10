/* 
const seURL = 'https://api.streamelements.com/kappa'
const seScopes = 'channel:read activities:read activities:write overlays:read overlays:write tips:read tips:write loyalty:read loyalty:write bot:read bot:write'

// Getting the top users on Streamelements leaderboard
// Usage: https://seapi.c4ldas.com.br/top/c4ldas?amount=5
app.get('/top/:username', async (req, res) => {

  const points = req.query.points || false
  const amount = req.query.amount;
  const order = req.query.order || 'asc'
  const accountId = await getAccountId(req.params.username);

  if (amount < 1 || amount > 1000) {
    res.status(200).send(`Minimum amount: 1. Max amount: 1000`)
    return
  }

  if (accountId.code == 404) {
    res.status(404).send(`Channel not found`)
    console.log('Account Id for that username not found')
    return
  }

  const userList = await getTopLeaderboard(accountId, amount, points)
  order == 'desc' ? topUsers = userList.reverse().join(', ') : topUsers = userList.join(', ')
  
  console.log(`${new Date().toLocaleTimeString('en-UK')} - Channel: ${req.params.username} - Users: ${topUsers}`)
  res.status(200).send(topUsers)
})


// Get top leaderboard users based on account ID
async function getTopLeaderboard(accountId, amount = 1, points) {
  try {
    const topUsernameRequest = await fetch(`${seURL}/v2/points/${accountId}/top?limit=${amount}&offset=0`, {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });

    const topUsernames = await topUsernameRequest.json();
    const usersArray = await topUsernames.users;
    const totalUsers = [];

    usersArray.forEach((element, index) => {
      if (points == 'true') {
        totalUsers.push(`${index + 1}. ${element.username} (${element.points})`);
      } else {
        totalUsers.push(`${element.username}`);
      }
    })
    return totalUsers;
    // const topUsernames = totalUsers.join(', ')
    // return topUsernames

  } catch (error) {
    console.log(error);
    ////////////////////////////////////////////////////////////////////////////////////
    /////////// Check this error object ////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////
    return { error: error.response.data.message, code: error.response.data.statusCode }
  }
}


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
 */