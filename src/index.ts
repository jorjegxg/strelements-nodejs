require('dotenv').config();
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import listEndpoints from 'express-list-endpoints';
import pool from './config/db';
import corsMiddleware from './middleware/cors';
import kickRouter from './routes/kick';

const app = express();

app.use(corsMiddleware);
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.use('/kick', kickRouter);


console.log(listEndpoints(app));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Root!' });
});

app.listen(port, () => {
  console.log(`Backend server at http://localhost:${port}`);
});



///////////////////////



app.get('/db', async (req: Request, res: Response) => {


  async function createTable() {
    try {
      const result = await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL
        );
      `);
      console.log(result);
      res.json({ message: 'DB!' });
    } catch (err) {
      console.error(err);
    }
  }

  // async function insertUser() {
  //   try {
  //     const result = await pool.query(`
  //       INSERT INTO users (name, email, password)
  //       VALUES ('John Doe', 'rI5tA@example.com', 'password123');
  //     `);
  //     console.log(result);
  //     res.json({ message: 'DB!' });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }



  async function getUsers() {
    try {
      const result = await pool.query('SELECT * FROM users;');
      console.log(result.rows);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
    }
  }

  // await insertUser();
  await getUsers();




});
