import {getReply} from './getReply.js';
import db from '../database/initDB.js';

async function getAllIncidents(req, res, next) {
  try {
    const allIncidents = await db.incidents.findAll({
      include: ['call', 'dispatch', 'location', 'unit']
    });
    const reply = getReply(allIncidents);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function createNewIncident(req, res, next) {
  try {
    console.log(req.body);
    const newIncident = await db.incidents.create(req.body, {
      include: ['call', 'dispatch', 'location', 'unit']
    });
    const oldUnit = newIncident.unit.unit_id;
    newIncident.unit_id = 1;
    // console.log(oldUnit);
    newIncident.save();
    const id = newIncident.call.call_id;
    res.json({message: `Inserted new entry in "incidents" with call_id ${id}.`, data: [newIncident]});
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function getIncident(req, res, next) {
  try {
    const incident = await db.incidents.findAll({
      where: {
        incident_id: req.params.incident_id
      },
      include: ['call', 'dispatch', 'location', 'unit']
    });
    const reply = getReply(incident);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function updateIncident(req, res, next){
  try {
    const incidentArr = await db.incidents.findAll( { where: { incident_id: req.params.incident_id } } );
    const incident = incidentArr[0];
    incident.date = req.body.date;
    incident.description = req.body.description;
    incident.postal_code = req.body.postal_code;
    incident.district_code = req.body. district_code;
    incident.call_id = req.body.call_id;
    incident.dispatch_id = req.body.dispatch_id;
    incident.unit_id = req.body.unit_id;
    incident.locations_id = req.body.locations_id;
    
    await incident.save();
    res.json({message: 'Successfully updated an incident.'});
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function deleteIncident(req, res, next) {
  try {
    console.log(req.params);
    const deleted = await db.incidents.destroy({
      where: {
        incident_id: req.params.incident_id
      }
    });
    if (deleted > 0) {
      res.send({message: `Deleted ${deleted} rows in incidents.`});
    } else if (deleted === 0) {
      res.send({message: 'No rows deleted.'});
    } else {
      res.json({message: 'Server error'});
    }
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
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
     res.json({error: 'Server error'});;
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
    res.json({error: 'Server error'});;
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
    res.json({error: 'Server error'});;
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
    res.json({error: 'Server error'});;
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