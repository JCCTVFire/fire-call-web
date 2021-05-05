import {getReply} from './getReply.js';
import db from '../database/initDB.js';

async function getAllLocations(req, res, next) {
  try {
    const allLocations = await db.locations.findAll();
    const reply = getReply(allLocations);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function createNewLocation(req, res, next) {
  try {
    const existing = await db.locations.findAll({ where: { locations_id: req.body.locations_id } });
    
    if (existing.length > 0) {
      res.json({message: `Entry with locations_id ${req.body.locations_id} already exists`})
    } else {
      const newLocation = await db.locations.create({
        locations_id: req.body.locations_id,
        lat: req.body.lat,
        long: req.body.long
      });
      res.json({message: 'Inserted new entry in "locations".'})
    }
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function getLocation(req, res, next) {
  try {
    const location = await db.locations.findAll({
      where: {
        locations_id: req.params.locations_id
      }
    });
    const reply = getReply(location);
    res.json(reply)
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function updateLocation(req, res, next) {
  try {
    await db.locations.update({
        lat: req.body.lat,
        long: req.body.long
    },
    {
      where: {
        locations_id: req.params.locations_id
      }
    });
    res.json({message: 'Successful update.'});
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function deleteLocation(req, res, next) {
  try {
    const deleted = await db.locations.destroy({
      where: {
        locations_id: req.params.locations_id
      }
    });
    if (deleted > 0) {
      res.json({message: `Deleted ${deleted} rows in locations.`});
    } else if (deleted === 0) {
      res.json({message: 'No rows deleted.'});
    } else {
      res.json({error: 'Less than 0 results in deleted.'});
    }
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

export {
    getAllLocations,
    createNewLocation,
    getLocation,
    updateLocation,
    deleteLocation
}