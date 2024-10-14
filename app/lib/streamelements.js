const SE_CLIENT_ID = process.env.SE_CLIENT_ID;
const SE_CLIENT_SECRET = process.env.SE_CLIENT_SECRET;
const SE_REDIRECT_URI = process.env.SE_REDIRECT_URI;

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

export { getTokenCode, getUserData, revokeToken };

/*
import { NextResponse } from "next/server";
import decrypt from "@/app/lib/encode_key";

const env = process.env.ENVIRONMENT;
const TWITCH_REDIRECT_URI = process.env.TWITCH_REDIRECT_URI;
let TWITCH_CLIENT_ID;
let TWITCH_CLIENT_SECRET;

if (env == "dev") {
  TWITCH_CLIENT_ID = decrypt(process.env.TWITCH_CLIENT_ID);
  TWITCH_CLIENT_SECRET = decrypt(process.env.TWITCH_CLIENT_SECRET);

} else {
  TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
  TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
}

async function getTokenCode(code) {
  try {
    const request = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      body: new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: TWITCH_REDIRECT_URI,
      }),
    });
    const response = await request.json();
    return response;

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

async function getUserData(accessToken) {
  try {
    const request = await fetch("https://api.twitch.tv/helix/users", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        "Client-Id": TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    const response = await request.json();
    return response.data[0];

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

async function createPrediction(accessToken, broadcasterId, question, options, time) {
  try {
    const request = await fetch('https://api.twitch.tv/helix/predictions', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${accessToken}`,
        'Client-Id': TWITCH_CLIENT_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'broadcaster_id': broadcasterId,
        'title': question !== null ? question : 'Quem ganha esse mapa?',
        'prediction_window': time,
        'outcomes': options.map(option => { return { "title": option } })
      })
    });

    const response = await request.json();
    if (response.status) throw new Error('Failed to create prediction', { status: response.status });

    // console.log("Create prediction:", response);
    return { status: "success", message: `Prediction created successfully. Question: ${question}` };

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

async function closePrediction(accessToken, broadcasterId, predictionId, winner) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/predictions`, {
      "next": { revalidate: 0 },
      "method": "PATCH",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Client-Id": TWITCH_CLIENT_ID,
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "broadcaster_id": broadcasterId,
        "status": "RESOLVED",
        "id": predictionId,
        "winning_outcome_id": winner.id
      })
    });

    const response = await request.json();
    if (response.status) throw new Error('Failed to close prediction', { status: response.status });

    // console.log("Close prediction:", response);
    return { status: "success", message: `Prediction closed successfully. Winner: ${winner.title}` };

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

async function cancelPrediction(accessToken, broadcasterId, predictionId) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/predictions`, {
      "next": { revalidate: 0 },
      "method": "PATCH",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Client-Id": TWITCH_CLIENT_ID,
        "Content-Type": "application/json"
      },
      "body": JSON.stringify({
        "broadcaster_id": broadcasterId,
        "status": "CANCELED",
        "id": predictionId
      })
    });

    const response = await request.json();
    if (response.status) throw new Error('Failed to cancel prediction', { status: response.status });

    // console.log("Cancel prediction:", response);
    return { status: "success", message: 'Prediction cancelled successfully' };

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

async function getOpenPrediction(accessToken, broadcasterId) {
  try {
    const request = await fetch(`https://api.twitch.tv/helix/predictions?broadcaster_id=${broadcasterId}&first=1`, {
      "next": { revalidate: 0 },
      "method": "GET",
      "headers": {
        "Authorization": `Bearer ${accessToken}`,
        "Client-Id": TWITCH_CLIENT_ID
      }
    });
    const response = await request.json();
    // console.log('getOpenPrediction: ', response.data[0]);

    // If no open prediction, return {}
    if (response.data[0].status != "ACTIVE" && response.data[0].status != "LOCKED") return null;

    // Return the open prediction
    return response.data[0];

  } catch (error) {
    console.log(error);
    throw { status: "failed", message: error.message };
  }
}

// Not used
async function sendResponse(song, type, channel) {
  try {
    const songName = song.item.name;
    const artists = song.item.artists.map(artist => artist.name).join(" & ");
    const songIsPlaying = song.is_playing;

    if (type == "json") {
      const data = {
        "name": song.item.name,
        "artists": song.item.artists.map(artist => artist.name).join(" & "),
        "artists_array": song.item.artists,
        "is_playing": song.is_playing,
        "album": song.item.album.name,
        "album_art": song.item.album.images,
        "timestamp": song.timestamp,
        "progress_ms": song.progress_ms,
        "duration_ms": song.item.duration_ms,
        "popularity": song.item.popularity,
        "song_preview": song.item.preview_url,
      }

      return NextResponse.json(data, { status: 200 });
    }

    if (!songIsPlaying) {
      return new Response("No song playing!", { status: 200 });
    }

    return new Response(`${artists} - ${songName}`, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.error }, { status: 200 });
  }
}

export { getTokenCode, getUserData, createPrediction, cancelPrediction, getOpenPrediction, closePrediction };
*/