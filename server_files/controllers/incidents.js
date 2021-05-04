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

async function createNewIncident(req, res, next) {
  try {
    const exists = await db.incidents.findAll({ where: { incident_id: req.body.incident_id}});
    
    if (exists.length > 0) {
      res.json({message: `Error: Entry with incident_id ${req.body.incident_id} already exists!`});
    } else {
      const newIncident = await db.incidents.create({
        incident_id:  req.body.incident_id,
        date: req.body.date,
        description: req.body.description,
        postal_code: req.body.postal_code,
        district_code: req.body.district_code,
        call_id: req.body.call_id,
        dispatch_id: req.body.dispatch_id,
        unit_id: req.body.unit_id,
        locations_id: req.body.locations_id
      });
      res.send("Successfully created new incident!");
    }
  } catch (err) {
    console.error(err);
    res.send('Server Error!');
  }
}

async function getIncident(req, res, next) {
  try {
    const incident = await db.incidents.findAll({
      where: {
        incident_id: req.params.incident_id
      }
    });
    const reply = getReply(incident);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.send('Server Error!');
  }
}

async function updateIncident(req, res, next){
  try {
    await db.incidents.update({
      date: req.body.date,
      description: req.body.description,
      postal_code: req.body.postal_code,
      district_code: req.body.district,
      call_id: req.body.call_id,
      dispatch_id: req.body.dispatch_id,
      unit_id: req.body.unit_id,
      locations_id: req.body.locations_id
    },
    {
      where: {
        incident_id: req.params.incident_id
      }
    });
    res.send('Successful update.');
  } catch (err) {
    console.error(err);
    res.send('Server Error!');
  }
}
async function deleteIncident(req, res, next){
  try {
    console.log(req.params)
    const deleted = await db.incidents.destroy({
      where: {
        incident_id: req.params.incident_id
      }
    });
    if (deleted > 0) {
      res.send(`Deleted ${deleted} rows.`);
    } else if (deleted === 0) {
      res.send('No rows deleted.');
    } else {
      res.send('Server Error!');
    }
  } catch (err) {
    console.error(err);
    res.send('Server Error!');
  }
}

async function getCallFromIncident(req, res, next) {
  try {
    const getIncidents = await db.incidents.findAll({
      where: {
        incident_id: req.params.incident_id
      }
    });    
    
    const allCalls = await db.calls.findAll({
      where: {
        call_id: getIncidents[0].dataValues.call_id
      }
    });

    const reply = getReply(allCalls);
    res.json(reply);
  }
   catch (err) {
     console.error(err);
     res.send(error);
   }
}
async function getUnitFromIncident(req, res, next) {
  try {
    const getUnit = await db.incidents.findAll({
      where: {
        incident_id: req.params.incident_id
      }
    });    
    console.log(getUnit);
    
    const allUnits = await db.units.findAll({
      where: {
        unit_id: getUnit[0].dataValues.unit_id
      }
    });

    const reply = getReply(allUnits);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
}
async function getDispatchFromIncident(req, res, next) {
  try { 
    const getIncidents = await db.incidents.findAll({
      where: {
        incident_id: req.params.incident_id
      }
    });    
    const getDispatch = await db.dispatch.findAll({
      where: {
        dispatch_id: getIncidents[0].dataValues.dispatch_id
      }
    });
    const reply = getReply(getDispatch);
    res.json(reply);
  }
  catch (err) {
    console.error(err);
    res.send(error);
  }
}
async function getLocationFromIncident(req, res, next) {
  try { 
    const getIncidents = await db.incidents.findAll({
      where: {
        incident_id: req.params.incident_id
      
      } 
    });    
    const getLocations = await db.locations.findAll({
      where: {
        locations_id: getIncidents[0].dataValues.locations_id
      }
    });
    const reply = getReply(getLocations);
    res.json(reply);
  }
  catch (err) {
    console.error(err);
    res.send(error);
  }
}

export {
  getAllIncidents,
  createNewIncident,
  getIncident,
  updateIncident,
  deleteIncident,
  //Child tables from incidents
  getCallFromIncident,
  getUnitFromIncident,
  getDispatchFromIncident,
  getLocationFromIncident
}