import db from '../database/initDB.js';
import sequelize from 'sequelize';
import {getReply} from './getReply.js';

const Op = sequelize.Op

async function getInitMapPoints(req, res, next) {
  try { 
    const initPoints = await db.incidents.findAll({
      attributes: ['incident_id', 'date', 'description', 'postal_code', 'district_code'],
      limit: 20,
      include: ['call', 'location']
    });
    // console.log(initPoints);
    const reply = getReply(initPoints);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

export {
  getInitMapPoints
}