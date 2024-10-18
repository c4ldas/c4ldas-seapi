const SE_CLIENT_ID = process.env.SE_CLIENT_ID;
const SE_CLIENT_SECRET = process.env.SE_CLIENT_SECRET;
const SE_REDIRECT_URI = process.env.SE_REDIRECT_URI;

// Get access_token from Streamelements
async function getTokenCode(code) {
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
async function getUserData(accessToken) {
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
async function revokeToken(se_access_token) {
  try {
    const request = await fetch(`https://api.streamelements.com/oauth2/revoke?client_id=${process.env.SE_CLIENT_ID}&token=${se_access_token}`)
    if (!request.ok) {
      throw new Error('Failed to revoke token');
    }
    return true;

  } catch (error) {
    console.log("revokeToken:", error);
    throw new Error('Failed to revoke token');
  }
}

// Overlay List
async function getOverlays(data) {
  try {
    const request = await fetch(`https://api.streamelements.com/kappa/v2/overlays/${data.id}`, {
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
async function getOverlayInfo(data) {
  try {
    const request = await fetch(`https://api.streamelements.com/kappa/v2/overlays/${data.accountId}/${data.overlayId}`, {
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
async function overlayInstall(data) {
  try {
    const request = await fetch(`https://api.streamelements.com/kappa/v2/overlays/${data.id}`, {
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

  // // URL format:
  // // https://streamelements.com/overlay/data._id/channelData.apiToken
  // return {
  //   isValid: true, overlayId: data._id, apiToken: channelData.apiToken, overlayName: data.name,
  //   overlayWidth: data.settings.width, overlayHeight: data.settings.height
  // }
}

// Encode state for token request
function encodeData(data) {
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
function decodeData(data) {
  try {
    // Re-add the URL unsafe characters
    let urlDecoded = data.replace(/-/g, '+').replace(/_/g, '/');
    // Add padding
    const padding = 4 - (urlDecoded.length % 4);
    if (padding !== 4) urlDecoded += '='.repeat(padding);

    return atob(urlDecoded);
  } catch (error) {
    console.log(error);
    return { status: "failed", message: error.message };
  }
}

export { getTokenCode, getUserData, revokeToken, getOverlays, getOverlayInfo, overlayInstall, encodeData, decodeData };
