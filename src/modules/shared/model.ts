import pool from "../../config/db";
import { NameOfPlatform } from "./types";
//TODO: Revino aiaic

export const createConnectionToPlatform = async (
  nameOfPlatform: NameOfPlatform,
  app_user_id: number,
  platform_user_id: number,
  name: string,
  email: string
) => {
  try {
    //1. get platform id of the platform
    const query1 = `SELECT * FROM PLATFORMS WHERE NAME = $1`;
    const values1 = [nameOfPlatform];
    let respone = await pool.query(query1, values1);
    let platform_id = respone.rows[0].id;

    //2. add user connection
    const query2 = `INSERT INTO connections_to_platform (app_user_id, platform_id, platform_user_id, name, email) VALUES ($1, $2,$3,$4,$5)`;
    const values2 = [app_user_id, platform_id, platform_user_id, name, email];
    await pool.query(query2, values2);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

/***
Returneaza UserId ul global (nu kickId)
***/
export const userIdIfExists = async (
  platformId: number
): Promise<number | null> => {
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
