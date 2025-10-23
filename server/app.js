import express from 'express';
import routes from './config/routes.js';
import cors from 'cors';
import { dbTest } from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: 'http://localhost:5173' }));

app.use(express.static('public'));

app.use('/api', routes);

const start = async () => { 
  if (await dbTest()) {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}

start();
