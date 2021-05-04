import express from 'express';
import sequelize from 'sequelize';
import db from '../database/initDB.js';
import { getSearchResults } from '../controllers/search.js';
import { createNewIncident, deleteIncident, getAllIncidents, getCallFromIncident, getDispatchFromIncident, getIncident, getLocationFromIncident, getUnitFromIncident, updateIncident } from '../controllers/incidents.js';
import { createNewCall, deleteCall, getAllCalls, getCall, updateCall } from '../controllers/calls.js';
import { createNewLocation, deleteLocation, getAllLocations, updateLocation } from '../controllers/locations.js';

const Op = sequelize.Op;
const router = express.Router();


function getReply(results) {
  try {
    return results.length > 0 ? {data: results, count: results.length} : {message: 'No results found.'};
  } catch (err) {
    console.log(err);
    return {message: 'Server error'};
  }
}
// New route template
router.route('/newRoute')
  .get(async (req, res) => {
    res.json({message: 'Action not available'});
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action unavailable.'});
  });



// INCIDENTS
router.route('/incidents')
  .get(async (req, res) => {
    await getAllIncidents(req, res);
  })
  .post(async (req, res) => {
    await createNewIncident(req, res);
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action unavailable.'});
  });

router.route('/incidents/:incident_id')
  .get(async (req, res) => {
    await getIncident(req, res);
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    await updateIncident(req, res);
  })
  .delete(async (req, res) => {
    await deleteIncident(req, res);
  });

// Gets the unit from an incident
router.get('/incidents/:incident_id/units', async (req, res) => {
  await getUnitFromIncident(req, res);
});

//Get calls from an incident
router.get('/incidents/:incident_id/calls', async (req, res) => {
  await getCallFromIncident(req, res);
});

router.get('/incidents/:incident_id/dispatch', async (req, res) => {
  await getDispatchFromIncident(req, res);
});

router.get('/incidents/:incident_id/locations', async (req, res) => {
  await getLocationFromIncident(req, res);
});

// CALLS
router.route('/calls')
  .get(async (req, res) => {
    await getAllCalls(req, res);
  })
  .post(async (req, res) => {
    await createNewCall(req, res);
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action unavailable.'});
  });

router.route('/calls/:call_id')
  .get(async (req, res) => {
    await getCall(req, res);
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    await updateCall(req, res);
  })
  .delete(async (req, res) => {
    await deleteCall(req, res);
  });

// LOCATIONS
router.route('locations')
  .get(async (req, res) => {
    await getAllLocations(req, res);
  })
  .post(async (req, res) => {
    await createNewLocation(req, res);
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action unavailable.'});
  });

router.route('/locations/:locations_id')
  .get(async (req, res) => {
    await getLocation(req, res);
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    await updateLocation(req, res);
  })
  .delete(async (req, res) => {
    await deleteLocation(req, res);
  });

router.route('/dispatch')
  .get(async (req, res) => {
    try {
      const dispatch = await db.dispatch.findAll();
      const reply = getReply(dispatch);
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  })
  .post(async (req, res) => {
    try {
      const newDispatch = await db.dispatch.create({
        dispatch_id: req.body.dispatch_id,
        dispatch_time: req.body.dispatch_time,
        arrival_time: req.body.arrival_time,
        response_time: req.body.response_time,
        arrival_unit: req.body.arrival_unit,
        cleared_time: req.body.cleared_time,
      });
      res.json(newDispatch);
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action unavailable.'});
  });

router.route('/dispatch/:dispatch_id')
  .get(async (req, res) => {
    try {
      const dispatch = await db.dispatch.findAll({
        where: {
          dispatch_id: req.params.dispatch_id
        }
      });
      const reply = getReply(dispatch);
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    try {
      await db.dispatch.update({
        dispatch_time: req.body.dispatch_time,
        arrival_time: req.body.arrival_time,
        response_time: req.body.response_time,
        arrival_unit: req.body.arrival_unit,
        cleared_time: req.body.cleared_time,
      },
      {
        where: {
          dispatch_id: req.params.dispatch_id
        }
      });
      res.json({message: 'Successful update.'});
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  })
  .delete(async (req, res) => {
    try {
      // console.log(req.params)
      const deleted = await db.dispatch.destroy({
        where: {
          dispatch_id: req.params.dispatch_id
        }
      });
      if (deleted > 0) {
        res.json({message: `Deleted ${deleted} rows in dispatch.`});
      } else if (deleted === 0) {
        res.json({message: 'No rows deleted.'});
      } else {
        res.json({error: 'Server error'});
      }
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  });

// units
router.route('/units')
  .get(async (req, res) => {
    try {
      const units = await db.units.findAll();
      const reply = getReply(units);
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  })
  .post(async (req, res) => {
    try {
      const newUnit = await db.units.create({
        unit_id: req.body.unit_id,
        unit_number: req.body.unit_number,
        unit_class_name: req.body.unit_class_name
      })
      res.json({message: 'New unit created!'});
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action unavailable.'});
  });

router.route('/units/:unit_id')
  .get(async (req, res) => {
    try {
      const unit = await db.units.findAll({
        where: {
          unit_id: req.params.unit_id
        }
      });
      const reply = getReply(unit);
      res.json(reply)
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    try {
      await db.units.update({
        unit_number: req.body.unit_number,
        unit_class_name: req.body.unit_class_name
      },
      {
        where: {
          unit_id: req.params.unit_id
        }
      });
      res.json({message: 'Successful update.'});
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  })
  .delete(async (req, res) => {
    try {
      console.log(req.params)
      const deleted = await db.units.destroy({
        where: {
          unit_id: req.params.unit_id
        }
      });
      if (deleted > 0) {
        res.json({error: 'Server error'});
      } else if (deleted === 0) {
        res.json({message: 'No rows deleted.'});
      } else {
        res.json({error: 'Server error'});
      }
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  });


router.route('/search')
.get(async (req, res) => {
  await getSearchResults(res, req);
})
.post(async (req, res) => {
  res.json({message: 'Action not available.'});
})
.put(async (req, res) => {
  res.json({message: 'Action not available.'});
})
.delete(async (req, res) => {
  res.json({message: 'Action unavailable.'});
});

// Custom query
router.route('/custom')
  .get(async (req, res) => {
    try {
      const custom = await db.sequelizeDB.query(req.body.query, {
        type: sequelize.QueryTypes.SELECT
      });
      req.json(custom);
    } catch (err) {
      console.log(err);
      res.json({error: 'Server error'});
    }
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action unavailable.'});
  });

export default router;

//////////////////
///// UNUSED /////
//////////////////
// JURISDICTION
router.route('/jurisdiction')
  .get(async (req, res) => {
    try {
      const jurisdiction = await db.jurisdiction.findAll();
      const reply  = getReply(jurisdiction);
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action not available.'});
  });

  // EMPLOYEES
router.route('/employees')
.get(async (req, res) => {
  try {
    const employees = await db.employees.findAll();
    const reply = getReply(employees);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
})
.post(async (req, res) => {
  res.json({message: 'Action not available.'});
})
.put(async (req, res) => {
  res.json({message: 'Action not available.'});
})
.delete(async (req, res) => {
  res.json({message: 'Action unavailable.'});
});

// STATIONS
router.route('/stations')
  .get(async (req, res) => {
    try {
      const stations = await db.stations.findAll();
      const reply = getReply(stations);
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.json({error: 'Server error'});
    }
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action unavailable.'});
  });