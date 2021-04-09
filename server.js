import express from 'express';
import db from './server_files/database/initDB.js';
import routes from './server_files/routes/routes.js';

// Have you changed your database/config.js values

const app = express();
const PORT = process.env.PORT || 3000;
const staticFolder = "public";


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(staticFolder));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

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
  