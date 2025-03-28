require('dotenv').config();
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import listEndpoints from 'express-list-endpoints';
import corsMiddleware from './middleware/cors';
import { requestLogger } from './middleware/logger';
import kickRouter from './routes/kick';
import { subscribeToEvents } from './services/hooksService';

const app = express();

app.use(corsMiddleware);
app.use(bodyParser.json());
const port = process.env.PORT || 3000;

app.use('/kick', kickRouter);

app.use(requestLogger);
console.log(listEndpoints(app));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Root!' });
});

app.listen(port, () => {
  console.log(`Backend server at http://localhost:${port}`);
});

app.post('/toggle', async (req: Request, res: Response) => {

  const { isActive, accessToken } = req.body;

  if (isActive === undefined) {
    res.status(400).json({ message: 'Missing required parameter(isActive)' });
    return;
  }

  if (accessToken === undefined) {
    res.status(400).json({ message: 'Missing required parameter(accessToken)' });
    return;
  }

  console.log('Received isActive:', isActive);
  console.log('Received accessToken:', accessToken);


  ///////////////

  try {
    const response = await subscribeToEvents(accessToken);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ error: "Error subscribing to events" });
  }
  ///////////////
});





///////////////////////

// app.get('/db', async (req: Request, res: Response) => {


//   async function createTable() {
//     try {
//       const result = await pool.query(`
//         CREATE TABLE IF NOT EXISTS users (
//           id SERIAL PRIMARY KEY,
//           name VARCHAR(255) NOT NULL,
//           email VARCHAR(255) NOT NULL,
//           password VARCHAR(255) NOT NULL
//         );
//       `);
//       console.log(result);
//       res.json({ message: 'DB!' });
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   // async function insertUser() {
//   //   try {
//   //     const result = await pool.query(`
//   //       INSERT INTO users (name, email, password)
//   //       VALUES ('John Doe', 'rI5tA@example.com', 'password123');
//   //     `);
//   //     console.log(result);
//   //     res.json({ message: 'DB!' });
//   //   } catch (err) {
//   //     console.error(err);
//   //   }
//   // }



//   async function getUsers() {
//     try {
//       const result = await pool.query('SELECT * FROM users;');
//       console.log(result.rows);
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   // await insertUser();
//   await getUsers();




// });
