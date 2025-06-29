import pool from "../../config/db";

export type DbUser = {
  name: string;
  email: string;
  kickId: number;
};

export type SessionType = {
  session_id: number;
  app_user_id: number;
};

/***
Returneaza UserId ul global (nu kickId)
***/
const userIdIfExists = async (platformId: number) => {
  try {
    const query = `SELECT * FROM connections_to_platform WHERE platform_user_id = $1`;
    const values = [platformId];

    const result = await pool.query(query, values);

    return result!.rowCount! > 0 ? result.rows[0].app_user_id : null;
  } catch (error) {
    console.error("Error checking user:", error);
    throw new Error("Failed to check user");
  }
};

/***
Functia insereaza in app_users userul atat
***/
const insertUserInDb = async (user: DbUser): Promise<number> => {
  try {
    const { name, email } = user;

    const query = `INSERT INTO APP_USERS (name, email) VALUES ($1, $2) RETURNING id`;
    const values = [name, email];

    const result = await pool.query(query, values);

    return result.rows[0].id;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

//PAS4: DACA EXISTA, FA O SESIUNE NOUA
const createSession = async (userId: number) => {
  try {
    const query = `INSERT INTO sessions (app_user_id) VALUES ($1) RETURNING session_id`;
    const values = [userId];
    const result = await pool.query(query, values);
    const sessionId = result.rows[0].session_id;
    return sessionId;
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Failed to create session");
  }
};

export { createSession, insertUserInDb, userIdIfExists };
