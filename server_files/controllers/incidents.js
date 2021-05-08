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
    res.json({message: 'Server error'});
  }
}

async function createNewIncident(req, res, next) {
  try {
    // const existing = await db.incidents.findAll({ where: { incident_id: req.body.incident_id}});
    
    // if (existing.length > 0) {
    //   res.json({message: `Entry with incident_id ${req.body.incident_id} already exists!`});
    // } else {
      console.log(req.body);
    await db.incidents.create(req.body
    //   date: req.body.date,
    //   description: req.body.description,
    //   postal_code: req.body.postal_code,
    //   district_code: req.body.district_code,
    //   // call_id: req.body.call_id,
    //   // dispatch_id: req.body.dispatch_id,
    //   // unit_id: req.body.unit_id,
    //   // locations_id: req.body.locations_id,
    //   call:[{
    //     call_type: req.body.call_type,
    //     req.body.call_
    //   }]
    // }, {
    , {
      include: ['call', 'dispatch', 'location', 'unit']
    });
    res.send({message: 'Inserted new entry in "incidents".'});
    // }
  } catch (err) {
    console.error(err);
    res.json({message: 'Server error'});
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
    res.json({message: 'Server error'});
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
    res.json({message: 'Server error'});
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
      res.send({message: `Deleted ${deleted} rows in calls.`});
    } else if (deleted === 0) {
      res.send({message: 'No rows deleted.'});
    } else {
      res.json({message: 'Server error'});
    }
  } catch (err) {
    console.error(err);
    res.json({message: 'Server error'});
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
     res.json({message: 'Server error'});;
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
    res.json({message: 'Server error'});;
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
    res.json({message: 'Server error'});;
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
    res.json({message: 'Server error'});;
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