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
Functia insereaza in app_users userul atat
***/
const insertUserInDb = async (): Promise<number> => {
  try {
    const query = `INSERT INTO APP_USERS DEFAULT VALUES RETURNING id`;

    const result = await pool.query(query);

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

export { createSession, insertUserInDb };
