import { Pool } from 'pg';
const pool = new Pool();

async function connectToDatabase() {
  try {
    const client = await pool.connect();
    // console.log("Client connected");
    return client;

  } catch (error) {
    console.log("connectToDatabase():", error);
    throw (error);
  }
}

export async function testConnectionDatabase() {
  let client;
  try {

    const select = {
      text: 'SELECT id, username FROM streamelements where username = $1',
      values: ["c4ldas"],
    }

    client = await connectToDatabase();
    const { rows } = await client.query(select);

    const data = {
      success: true,
      message: "Query executed successfully",
      details: rows.map(row => ({ "id": row.id, "display_name": row.username })),
      status: 200
    }

    return data;

  } catch (error) {
    const { code, message, routine } = error

    const data = {
      success: false,
      message: error.message,
      details: { code, message, routine },
      status: 500
    }
    return data;

  } finally {
    if (client) client.release();
  }
}

export async function getTokenDatabase(request) {
  let client;

  try {
    const { tag, account_id, username, access_token, refresh_token } = request;

    const selectQuery = {
      text: `SELECT account_id, access_token, refresh_token FROM streamelements WHERE tag = $1`,
      values: [tag],
    }

    client = await connectToDatabase();
    const { rows } = await client.query(selectQuery);

    const data = {
      success: true,
      message: "Query executed successfully",
      details: rows[0],
      status: 200
    }

    return data;

  } catch (error) {
    const { code, message, routine } = error;

    const data = {
      success: false,
      message: error.message,
      details: { code, message, routine },
      status: 500
    }
    return data;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}

export async function seSaveToDatabase(data) {
  let client;

  try {
    const { tag, account_id, username, access_token, refresh_token } = data;

    const insertQuery = {
      text: `
      INSERT INTO streamelements (tag, account_id, username, access_token, refresh_token) 
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (account_id) DO
      UPDATE SET tag = $1, username = $3, access_token = $4, refresh_token = $5
    `,
      values: [tag, account_id, username, access_token, refresh_token],
    }

    client = await connectToDatabase();
    const { rows } = await client.query(insertQuery);
    return true;

  } catch (error) {
    console.log("seSaveToDatabase(): ", error);
    return false;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}

export async function seRemoveDBIntegration(request) {
  let client;

  const { tag, account_id, username, access_token, refresh_token } = request;

  console.log("seRemoveDBIntegration request:", request);

  try {
    const removeQuery = {
      text: 'DELETE FROM streamelements WHERE account_id = $1 and username = $2',
      values: [account_id, username],
    }
    client = await connectToDatabase();
    const { rowCount } = await client.query(removeQuery);
    /*     if (rowCount === 0) {
          throw { error: "User not registered!" };
        } */
    return true;

  } catch (error) {
    console.log("seRemoveDBIntegration(): ", error);
    // throw error.message;
    return false;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}

export async function saveOverlayToDB(data) {
  let client;

  try {
    const { code, overlay_data, account_id, name } = data;

    const insertQuery = {
      text: `
      INSERT INTO overlays (code, data, account_id, name) 
      VALUES ($1, $2, $3, $4)
    `,
      values: [code, overlay_data, account_id, name],
    }

    client = await connectToDatabase();
    const { rows } = await client.query(insertQuery);
    return true;

  } catch (error) {
    console.log("saveOverlayToDB(): ", error);
    return false;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}

export async function getOverlayFromDB(request) {
  let client;

  try {
    const { code, overlay_data, account_id, name } = request;

    const selectQuery = {
      text: `SELECT data FROM overlays WHERE code = $1`,
      values: [code],
    }

    client = await connectToDatabase();
    const { rows } = await client.query(selectQuery);

    const data = {
      success: true,
      message: "Query executed successfully",
      details: rows[0].data,
      status: 200
    }

    return data;

  } catch (error) {
    const { code, message, routine } = error;

    const data = {
      success: false,
      message: error.message,
      details: { code, message, routine },
      status: 500
    }
    return data;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}

export async function getSharedOverlaysFromDB(request) {
  let client;

  try {
    const { code, overlay_data, account_id, name } = request;

    const selectQuery = {
      text: `SELECT code, name, data->>'preview' AS image FROM overlays WHERE account_id = $1`,
      values: [account_id],
    }

    client = await connectToDatabase();
    const { rows } = await client.query(selectQuery);

    const data = {
      success: true,
      message: "Query executed successfully",
      details: rows,
      status: 200
    }

    return data;

  } catch (error) {
    const { code, message, routine } = error;

    const data = {
      success: false,
      message: error.message,
      details: { code, message, routine },
      status: 500
    }
    return data;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}

export async function removeOverlayFromDB(request) {
  let client;

  try {
    const { code, overlay_data, account_id, name } = request;

    const deleteQuery = {
      text: `DELETE FROM overlays WHERE code = $1 AND account_id = $2`,
      values: [code, account_id],
    }

    client = await connectToDatabase();
    const { rows, rowCount } = await client.query(deleteQuery);

    if (rowCount == 0) {
      const error = new Error();
      error.code = 404;
      error.message = "Overlay not found";
      error.routine = "removeOverlayFromDB()";
      throw error;
    }

    const data = {
      success: true,
      message: "Query executed successfully",
      details: `Deleted ${rowCount} row(s)`,
      status: 200
    }
    return data;

  } catch (error) {
    const { code, message, routine } = error;

    const data = {
      success: false,
      message: error.message,
      details: { code, message, routine },
      status: code
    }
    throw data;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}

export async function checkIfTagExists(request) {
  let client;

  try {
    const { tag, account_id } = request;

    const selectQuery = {
      text: `SELECT tag FROM streamelements WHERE account_id = $1`,
      values: [account_id],
    }

    client = await connectToDatabase();
    const { rows } = await client.query(selectQuery);

    if (rows.length == 0) {
      const data = {
        success: false,
        message: "Tag not found",
        details: null,
        status: 200
      }
      return data;
    }

    const data = {
      success: true,
      message: "Query executed successfully",
      details: rows,
      status: 200
    }

    return data;

  } catch (error) {
    const { code, message, routine } = error;

    const data = {
      success: false,
      message: error.message,
      details: { code, message, routine },
      status: 500
    }
    return data;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}

