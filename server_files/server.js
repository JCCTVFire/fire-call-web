import express from 'express';
import db from './database/initDB.js';
import routes from './routes/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/api', routes);

async function bootServer() {
  try {
    const mysql = await db.sequelizeDB;
    await mysql.sync();
    app.listen(PORT, () => {
      console.log(`Listening on: http//localhost:${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
}

bootServer();
  