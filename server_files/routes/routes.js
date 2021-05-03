import express from 'express';
import sequelize from 'sequelize';
import db from '../database/initDB.js';
import incidents from '../models/incidents.js';
const Op = sequelize.Op;
const router = express.Router();


function getReply(results) {
  try {
    return results.length > 0 ? {data: results} : {message: 'No results found.'};
  } catch (err) {
    console.log(err);
    return {message: 'Server error!'};
  }
}
// New route template
router.route('/newRoute')
  .get(async (req, res) => {
    res.send('Action not available');
  })
  .post(async (req, res) => {
    res.send('Action not available.');
  })
  .put(async (req, res) => {
    res.send('Action not available.');
  })
  .delete(async (req, res) => {
    res.send('Action unavailable.');
  });



// INCIDENTS
router.route('/incidents')
  .get(async (req, res) => {
    try {
      const all_incidents = await db.incidents.findAll();
      const reply = getReply(all_incidents);
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.send('Server Error!');
    }
  })
  .post(async (req, res) => {
    try {
      const newIncident = await db.incidents.create({
        incident_id:  req.body.incident_id,
        date: req.body.date,
        description: req.body.description,
        postal_code: req.body.postal_code,
        district_code: req.body.district_code,
        call_id: req.body.call_id,
        dispatch_id: req.body.dispatch_id,
        unit_id: req.body.unit_id
      });
      res.json(newIncident);
    } catch (err) {
      console.error(err);
      res.send('Server Error!');
    }
  })
  .put(async (req, res) => {
    res.send('Action not available.');
  })
  .delete(async (req, res) => {
    res.send('Action unavailable.');
  });

router.route('/incidents/:incident_id')
  .get(async (req, res) => {
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
  })
  .post(async (req, res) => {
    res.send('Action not available.');
  })
  .put(async (req, res) => {
    try {
      await db.incidents.update({
        date: req.body.date,
        description: req.body.description,
        postal_code: req.body.postal_code,
        district_code: req.body.district
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
  })
  .delete(async (req, res) => {
    try {
      console.log(req.params)
      await db.incidents.destroy({
        where: {
          incident_id: req.params.incident_id
        }
      });
      res.send('Successful deletion.');
    } catch (err) {
      console.error(err);
      res.send('Server Error!');
    }
  });

// Gets the unit from an incident
router.get('/incidents/:incident_id/units', async (req, res) => {
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
});

//Get calls from an incident
router.get('/incidents/:incident_id/calls', async (req, res) => {
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
});

router.get('/incidents/:incident_id/dispatch', async (req, res) => {
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
});

router.get('/incidents/:incident_id/locations', async (req, res) => {
  try { 
    const getIncidents = await db.incidents.findAll({
      where: {
        incident_id: req.params.incident_id
      
      } 
    });    
    const getLocations = await db.locations.findAll({
      where: {
        incidents_incident_id: getIncidents[0].dataValues.incident_id
      }
    });
    const reply = getReply(getLocations);
    res.json(reply);
  }
  catch (err) {
    console.error(err);
    res.send(error);
  }
});

// router.get('/incidents/:incident_id/incident', async (req, res) => {
//   try { 
//     const getIncidents = await db.incidents.findAll({
//       where: {
//         incident_id: req.params.incident_id
//       }
//     });    
//     const reply = getReply(getIncidents);
//     res.json(reply);
//   }
//   catch (err) {
//     console.error(err);
//     res.send(error);
//   }
// });

 

// CALLS
router.route('/calls')
  .get(async (req, res) => {
    try {
      const calls = await db.calls.findAll();
      const reply = getReply(calls);
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.error('Server Error!')
    }
  })
  .post(async (req, res) => {
    try {
      const newCall = await db.calls.create({
        call_id: req.body.call_id,
        call_type: req.body.call_type,
        call_class: req.body.call_class,
        call_time: req.body.call_time
      })
      res.json(newCall);
    } catch (err) {
      console.error(err);
      res.send('Server Error!')
    }
  })
  .put(async (req, res) => {
    res.send('Action not available.');
  })
  .delete(async (req, res) => {
    res.send('Action unavailable.');
  });

router.route('/calls/:call_id')
  .get(async (req, res) => {
    try {
      const call = await db.calls.findAll({
        where: {
          call_id: req.params.call_id
        }
      });
      const reply = getReply(call);
      res.json(reply)
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
    }
  })
  .post(async (req, res) => {
    res.send('Action not available.');
  })
  .put(async (req, res) => {
    try {
      await db.calls.update({
        call_type: req.body.call_type,
        call_class: req.body.call_class,
        call_time: req.body.call_time
      },
      {
        where: {
          call_id: req.params.call_id
        }
      });
      res.send('Successful update.');
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
    }
  })
  .delete(async (req, res) => {
    try {
      console.log(req.params)
      await db.calls.destroy({
        where: {
          call_id: req.params.call_id
        }
      });
      res.send('Successful deletion.');
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
    }
  });

// LOCATION
router.route('locations')
  .get(async (req, res) => {
    try {
      const locations = await db.locations.findAll();
      const reply = getReply(locations);
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.error('Server Error!')
    }
  })
  .post(async (req, res) => {
    res.send('Action not available.');
  })
  .put(async (req, res) => {
    res.send('Action not available.');
  })
  .delete(async (req, res) => {
    res.send('Action unavailable.');
  });

router.route('/dispatch')
  .get(async (req, res) => {
    try {
      const dispatch = await db.dispatch.findAll();
      const reply = getReply(dispatch);
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.send('Server Error!');
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
      res.send('Server Error')
    }
  })
  .put(async (req, res) => {
    res.send('Action not available.');
  })
  .delete(async (req, res) => {
    res.send('Action unavailable.');
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
      res.error('Server Error!');
    }
  })
  .post(async (req, res) => {
    res.send('Action not available.');
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
      res.send('Successful update.');
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
    }
  })
  .delete(async (req, res) => {
    try {
      // console.log(req.params)
      await db.dispatch.destroy({
        where: {
          dispatch_id: req.params.dispatch_id
        }
      });
      res.send('Successful deletion.');
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
    }
  });

// unitS
router.route('/units')
  .get(async (req, res) => {
    try {
      const units = await db.units.findAll();
      const reply = getReply(units);
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.error('Server Error!')
    }
  })
  .post(async (req, res) => {
    try {
      const newUnit = await db.units.create({
        unit_id: req.body.unit_id,
        unit_number: req.body.unit_number,
        unit_class_name: req.body.unit_class_name
      })
      res.send('New unit created!');
    } catch (err) {
      console.error(err);
      res.send('Server Error!')
    }
  })
  .put(async (req, res) => {
    res.send('Action not available.');
  })
  .delete(async (req, res) => {
    res.send('Action unavailable.');
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
      res.error('Server Error!');
    }
  })
  .post(async (req, res) => {
    res.send('Action not available.');
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
      res.send('Successful update.');
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
    }
  })
  .delete(async (req, res) => {
    try {
      console.log(req.params)
      await db.units.destroy({
        where: {
          unit_id: req.params.unit_id
        }
      });
      res.send('Successful deletion.');
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
    }
  });


router.route('/search')
.get(async (req, res) => {
  try {
    // console.log(req)
    let incidentData = [];
    let incidentIDs = [];
    const matchCalls = await db.calls.findAll({
      where: {
        [Op.or]: [
          {
            call_type: {
              [Op.startsWith]: req.query.queryText
            } 
          },
          {
            call_class: {
              [Op.startsWith]: req.query.queryText
            }
          }
        ]
      },
      limit: 10
    });
    if (matchCalls !== 'NULL') {
      const callIDs = matchCalls.map((call) => {
        // console.log(call.dataValues.call_id);
        return call.dataValues.call_id;
      });
      const callsToIncidents = await db.incidents.findAll({
        where: {
          call_id: {
            [Op.in]: callIDs
          }
        },
      });
      let a = 0;
      callsToIncidents.map((unit) => {
        incidentIDs.push(unit.dataValues.incident_id);
        a += 1;
      });
      console.log("Calls:", a)
      // console.log(typeof callsToIncidents, callsToIncidents);
    }

    const matchUnits = await db.units.findAll({
      where: {
        [Op.or]: [
          {
            unit_number: {
              [Op.like]: req.query.queryText
            }
          },
          {
            unit_class_name: {
              [Op.like]: req.query.queryText
            }
          }
        ]
      },
      limit: 10
    });
    
    let unitsToIncidents = [];
    console.log(typeof matchUnits, matchUnits);
    if (matchUnits.length > 0) {
      const unitIDs = matchUnits.map((unit) => {
        return unit.dataValues.unit_id
      });

      unitsToIncidents = await db.incidents.findAll({ where: { unit_id: { [Op.in]: unitIDs } } });
      let b = 0;
      unitsToIncidents.forEach((unit) => {
        incidentIDs.push(unit.dataValues.incident_id);
        b += 1;
      });
      console.log("Units:", b);
    }

    console.log(`${req.query.endDate} 23:59:59`);
    const startDate = Date.parse(`${req.query.startDate}T00:00:00-00:00`);
    const endDate = Date.parse(`${req.query.endDate}T23:59:59-00:00`);

    const matchIncidents = await db.incidents.findAll({
      where: {
        [Op.and]: [
          {
            [Op.or]: [
              {
                incident_id: {
                  [Op.in]: incidentIDs
                }
              },
              { 
                description: {
                  [Op.startsWith]: req.query.queryText
                } 
              },
              { 
                postal_code: {
                  [Op.startsWith]: req.query.queryText
                } 
              },
            ]
          },
          {
            date: {
              [Op.between]: [startDate, endDate]
            }
          }
        ]
      },
      limit: 10
    });
    if (matchIncidents.length > 0) {
      let c = 0;
      matchIncidents.forEach((inc) => {
        incidentData.push(inc.dataValues);
        c += 1;
      });
    }
    // console.log(matchIncidents);
    
    // console.log(incidentData);
    // console.log(incidentData)
    // console.log(incidentData);
    // console.log(replyData);
    const reply = getReply(incidentData);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.send('Server Error!');
  }
})
.post(async (req, res) => {
  res.send('Action not available.');
})
.put(async (req, res) => {
  res.send('Action not available.');
})
.delete(async (req, res) => {
  res.send('Action unavailable.');
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
      res.send('Server Error!')
    }
  })
  .post(async (req, res) => {
    res.send('Action not available.');
  })
  .put(async (req, res) => {
    res.send('Action not available.');
  })
  .delete(async (req, res) => {
    res.send('Action unavailable.');
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
      res.send('Server Error!');
    }
  })
  .post(async (req, res) => {
    res.send('Action not available.');
  })
  .put(async (req, res) => {
    res.send('Action not available.');
  })
  .delete(async (req, res) => {
    res.send('Action not available.');
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
    res.send('Server Error!');
  }
})
.post(async (req, res) => {
  res.send('Action not available.');
})
.put(async (req, res) => {
  res.send('Action not available.');
})
.delete(async (req, res) => {
  res.send('Action unavailable.');
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
      res.send('Server Error!');
    }
  })
  .post(async (req, res) => {
    res.send('Action not available.');
  })
  .put(async (req, res) => {
    res.send('Action not available.');
  })
  .delete(async (req, res) => {
    res.send('Action unavailable.');
  });