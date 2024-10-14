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

async function testConnectionDatabase() {
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

async function seSaveToDatabase(data) {
  let client;

  try {
    const { id, username, access_token, refresh_token } = data;

    const insertQuery = {
      text: `
      INSERT INTO streamelements (id, username, access_token, refresh_token ) 
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (id) DO
      UPDATE SET username = $2, access_token = $3, refresh_token = $4
    `,
      values: [id, username, access_token, refresh_token],
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

async function seRemoveDBIntegration(id, username) {
  let client;

  try {
    const removeQuery = {
      text: 'DELETE FROM streamelements WHERE id = $1 and username = $2',
      values: [id, username],
    }
    client = await connectToDatabase();
    const { rowCount } = await client.query(removeQuery);
    if (rowCount === 0) {
      throw { error: "User not registered!" };
    }
    return true;

  } catch (error) {
    console.log("seRemoveIntegration(): ", error);
    throw error.message;

  } finally {
    if (client) client.release();
    // console.log("Client released");
  }
}

export { testConnectionDatabase, seSaveToDatabase, seRemoveDBIntegration };
