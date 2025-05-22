import pool from "../../config/db";

export type DbUser = {
  name: string;
  email: string;
  kick_id: number;
};

export type SessionType = {
  session_id: number;
  app_user_id: number;
};

//PAS2: VERIFICA DACA NU EXISTA DEJA IN DB
const checkUserExists = async (kick_id: number) => {
  try {
    const query = `SELECT * FROM APP_USERS WHERE kick_id = $1`;
    const values = [kick_id];

    const result = await pool.query(query, values);

    return {
      exists: result!.rowCount! > 0,
      userId: result!.rowCount! > 0 ? result.rows[0].app_user_id : null,
    };
  } catch (error) {
    console.error("Error checking user:", error);
    throw new Error("Failed to check user");
  }
};

//PAS3: DACA NU EXISTA, INSEREAZA IN DB
const insertUserInDb = async (user: DbUser) => {
  try {
    console.log("Mergi:");

    const { name, email, kick_id } = user;

    const query = `INSERT INTO APP_USERS (name, email, kick_id) VALUES ($1, $2, $3) RETURNING *`;
    const values = [name, email, kick_id];

    const result = await pool.query(query, values);

    return result.rows[0].app_user_id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};
//PAS4: DACA EXISTA, FA O SESIUNE NOUA
const createSession = async (userId: number) => {
  try {
    const query = `INSERT INTO session (app_user_id) VALUES ($1) RETURNING session_id`;
    const values = [userId];
    const result = await pool.query(query, values);
    const sessionId = result.rows[0].session_id;
    return sessionId;
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Failed to create session");
  }
};

export { checkUserExists, createSession, insertUserInDb };
