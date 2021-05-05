import express from 'express';
import sequelize from 'sequelize';
import db from '../database/initDB.js';
import { getReply } from '../controllers/getReply.js';
import { getSearchResults } from '../controllers/search.js';
import { createNewIncident, deleteIncident, getAllIncidents, getCallFromIncident, getDispatchFromIncident, getIncident, getLocationFromIncident, getUnitFromIncident, updateIncident } from '../controllers/incidents.js';
import { createNewCall, deleteCall, getAllCalls, getCall, updateCall } from '../controllers/calls.js';
import { createNewLocation, deleteLocation, getAllLocations, updateLocation, getLocation } from '../controllers/locations.js';
import { getAllUnits, createNewUnit, getUnit, updateUnit, deleteUnit } from '../controllers/units.js';
import { getAllDispatch, createNewDispatch, getDispatch, updateDispatch, deleteDispatch } from '../controllers/dispatch.js';

const Op = sequelize.Op;
const router = express.Router();

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

// Gets unit data from an incident
router.get('/incidents/:incident_id/units', async (req, res) => {
  await getUnitFromIncident(req, res);
});

// Get call data from an incident
router.get('/incidents/:incident_id/calls', async (req, res) => {
  await getCallFromIncident(req, res);
});

// Get dispatch data from an incident
router.get('/incidents/:incident_id/dispatch', async (req, res) => {
  await getDispatchFromIncident(req, res);
});

// Get location data from an incident
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
router.route('/locations')
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

// DISPATCH
router.route('/dispatch')
  .get(async (req, res) => {
    await getAllDispatch(req, res);
  })
  .post(async (req, res) => {
    await createNewDispatch(req, res);
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action unavailable.'});
  });

router.route('/dispatch/:dispatch_id')
  .get(async (req, res) => {
    await getDispatch(req, res);
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    await updateDispatch(req, res);
  })
  .delete(async (req, res) => {
    await deleteDispatch(req, res);
  });

// UNITS
router.route('/units')
  .get(async (req, res) => {
    await getAllUnits(req, res);
  })
  .post(async (req, res) => {
    await createNewUnit(req, res);
  })
  .put(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .delete(async (req, res) => {
    res.json({message: 'Action unavailable.'});
  });

router.route('/units/:unit_id')
  .get(async (req, res) => {
    await getUnit(req, res);
  })
  .post(async (req, res) => {
    res.json({message: 'Action not available.'});
  })
  .put(async (req, res) => {
    await updateUnit(req, res);
  })
  .delete(async (req, res) => {
    await deleteUnit(req, res);
  });

router.get('/search', async (req, res) => {
  await getSearchResults(res, req);
});

// Custom query
router.get('/custom', async (req, res) => {
  try {
    const customResult = await db.sequelizeDB.query(req.body.query, {
      type: sequelize.QueryTypes.SELECT
    });
    const reply = getReply(customResult);
    res.json(reply);
  } catch (err) {
    console.log(err);
    res.json({error: 'Server error'});
  }
});

export default router;

//////////////////
///// UNUSED /////
//////////////////
// JURISDICTION
// router.route('/jurisdiction')
//   .get(async (req, res) => {
//     try {
//       const jurisdiction = await db.jurisdiction.findAll();
//       const reply  = getReply(jurisdiction);
//     } catch (err) {
//       console.error(err);
//       res.json({error: 'Server error'});
//     }
//   })
//   .post(async (req, res) => {
//     res.json({message: 'Action not available.'});
//   })
//   .put(async (req, res) => {
//     res.json({message: 'Action not available.'});
//   })
//   .delete(async (req, res) => {
//     res.json({message: 'Action not available.'});
//   });

//   // EMPLOYEES
// router.route('/employees')
// .get(async (req, res) => {
//   try {
//     const employees = await db.employees.findAll();
//     const reply = getReply(employees);
//     res.json(reply);
//   } catch (err) {
//     console.error(err);
//     res.json({error: 'Server error'});
//   }
// })
// .post(async (req, res) => {
//   res.json({message: 'Action not available.'});
// })
// .put(async (req, res) => {
//   res.json({message: 'Action not available.'});
// })
// .delete(async (req, res) => {
//   res.json({message: 'Action unavailable.'});
// });

// // STATIONS
// router.route('/stations')
//   .get(async (req, res) => {
//     try {
//       const stations = await db.stations.findAll();
//       const reply = getReply(stations);
//       res.json(reply);
//     } catch (err) {
//       console.error(err);
//       res.json({error: 'Server error'});
//     }
//   })
//   .post(async (req, res) => {
//     res.json({message: 'Action not available.'});
//   })
//   .put(async (req, res) => {
//     res.json({message: 'Action not available.'});
//   })
//   .delete(async (req, res) => {
//     res.json({message: 'Action unavailable.'});
//   });