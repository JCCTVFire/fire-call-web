import Sequelize from 'sequelize';

import configOptions from './config.js';
import modelList from '../models/index.js';

const { DataTypes } = Sequelize;

// Have you changed your database/config.js values?

const env = process.env.NODE_ENV || 'development';
const config = configOptions[env];

let sequelizeDB;
if (config.use_env_variable) {
  sequelizeDB = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelizeDB = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
  try{
    await sequelizeDB.authenticate();
    console.log('Connection to db successfully established.')
    // console.log(`Connected to ${SequelizeDB.}`)
  } catch (err) {
    console.log('Connection to db not established')
  }
  
}

const db = Object.keys(modelList).reduce((collection, modelName) => {
  if (!collection[modelName]) {
    collection[modelName] = modelList[modelName](sequelizeDB, DataTypes);
    // console.log(collection[modelName]);
  }
  // console.log(modelList[modelName] == collection[modelName]);
  return collection;
}, {});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelizeDB = sequelizeDB;
db.Sequelize = Sequelize;

export default db;

