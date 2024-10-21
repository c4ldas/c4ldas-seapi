const SE_CLIENT_ID = process.env.SE_CLIENT_ID;
const SE_CLIENT_SECRET = process.env.SE_CLIENT_SECRET;
const SE_REDIRECT_URI = process.env.SE_REDIRECT_URI;

// Get access_token from Streamelements
export async function getTokenCode(code) {
  try {
    const request = await fetch("https://api.streamelements.com/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: SE_CLIENT_ID,
        client_secret: SE_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: SE_REDIRECT_URI
      }),
    });
    const response = await request.json();
    return response;

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

// Get data from Streamelements user
export async function getUserData(accessToken) {
  try {
    const request = await fetch("https://api.streamelements.com/kappa/v2/channels/me", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Client-Id": SE_CLIENT_ID,
        "Authorization": `oAuth ${accessToken}`,
      },
    });
    const response = await request.json();
    return response;

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

// Revoke token
export async function revokeToken(data) {
  try {
    const request = await fetch(`https://api.streamelements.com/oauth2/revoke?client_id=${process.env.SE_CLIENT_ID}&token=${data.access_token}`)
    if (!request.ok) {
      throw new Error('Failed to revoke token');
    }
    return true;

  } catch (error) {
    console.log("revokeToken:", error);
    return false;
  }
}

// Overlay List
export async function getOverlays(data) {
  try {
    const request = await fetch(`https://api.streamelements.com/kappa/v2/overlays/${data.account_id}`, {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Authorization": `oAuth ${data.access_token}`
      }
    });
    const response = await request.json();
    return response;

  } catch (error) {
    console.log("getOverlays():", error);
    throw { status: "failed", message: error.message };
  }
}

// Overlay data
export async function getOverlayInfo(data) {
  try {
    const request = await fetch(`https://api.streamelements.com/kappa/v2/overlays/${data.account_id}/${data.overlay_id}`, {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Authorization": `oAuth ${data.access_token}`
      }
    });
    const response = await request.json();
    return response;

  } catch (error) {
    console.log("getOverlayInfo():", error);
    throw { status: "failed", message: error.message };
  }
}

// Overlay installation - Add overlay to SE destination account
export async function overlayInstall(data) {
  try {
    const request = await fetch(`https://api.streamelements.com/kappa/v2/overlays/${data.account_id}`, {
      "method": "POST",
      "headers": {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `oAuth ${data.access_token}`
      },
      "body": JSON.stringify(data.overlay_data)
    });
    const response = await request.json();
    return response;

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

// Encode state for token request
export function encodeData(data) {
  try {
    const dateNow = Date.now();
    const encoded = btoa(`${data}_${dateNow}`);
    const urlEncoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    // console.log(urlEncoded);
    return urlEncoded;
  } catch (error) {
    console.log(error);
    return { status: "failed", message: error.message };
  }
}

// Decode state from token request
export function decodeData(data) {
  try {
    // Re-add the URL unsafe characters
    let urlDecoded = data.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding
    const padding = 4 - (urlDecoded.length % 4);
    if (padding !== 4) urlDecoded += '='.repeat(padding);

    return atob(urlDecoded);
  } catch (error) {
    console.error("decodeData() error:", error.message);
    return { status: "failed", message: error.message };
  }
}

// Generate Tag
// Pending check if the account ID is already registered. If so, uses the same tag
export async function generateTag() {
  try {
    const tag = crypto.randomUUID().split("-")[4];
    return tag;

  } catch (error) {
    console.log(error);
    return null;
  }
}

// Get Account ID from username
export async function getAccountInfo(username) {
  try {
    const request = await fetch(`https://api.streamelements.com/kappa/v2/channels/${username}`, {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
      }
    });
    const response = await request.json();
    return response;

  } catch (error) {
    console.log("getAccountInfo:", error.message);
    throw { status: "failed", message: error.message };
  }
}

// Get top leaderboard users based on account ID
export async function getTopLeaderboard(data) {
  try {
    const request = await fetch(`https://api.streamelements.com/kappa/v2/points/${data.accountId}/top?limit=${data.amount}&offset=0`, {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
      }
    });

    const response = await request.json();
    const usersArray = await response.users;
    const totalUsers = [];

    usersArray.forEach((element, index) => {
      if (data.points == "true") {
        totalUsers.push(`${index + 1}. ${element.username} (${element.points})`);
      } else {
        totalUsers.push(`${element.username}`);
      }
    })
    return totalUsers;

  } catch (error) {
    console.log("getTopLeaderboard:", error.message);
    throw { status: "failed", message: error.message };
  }
}

// Get top watchtime users based on account ID
export async function getTopWatchtime(data) {
  try {
    const request = await fetch(`https://api.streamelements.com/kappa/v2/points/${data.accountId}/watchtime?limit=${data.amount}&offset=0`, {
      "method": "GET",
      "headers": {
        "Accept": "application/json"
      }
    });
    const response = await request.json();
    const usersArray = response.users;
    const totalUsers = [];

    usersArray.forEach((element, index) => {
      if (data.minutes == "true") {
        const convertedMinutes = calculateTime(element.minutes)
        totalUsers.push(`${index + 1}. ${element.username} (${convertedMinutes})`)
      } else {
        totalUsers.push(`${element.username}`)
      }
    })

    return totalUsers;

  } catch (error) {
    console.log("getTopWatchtime:", error.message);
    throw { status: "failed", message: error.message };
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