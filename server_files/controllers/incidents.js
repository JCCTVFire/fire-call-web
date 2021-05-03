import {getReply} from './getReply.js';
import db from '../database/initDB.js';
async function getAllIncidents(req, res, next) {
  try {
    const all_incidents = await db.incidents.findAll();
    const reply = getReply(all_incidents);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.send('Server Error!');
  }
}

export {
  getAllIncidents,
  // createNewIncident
}