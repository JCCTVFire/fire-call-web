import express from 'express';
import sequelize from 'sequelize';
import db from '../database/initDB.js';
const Op = sequelize.Op;
const router = express.Router();


function getReply(results) {
  return results.length > 0 ? {data: results} : {message: 'No results found.'};
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
      const reply = all_incidents.length > 0 ? {data: all_incidents} : {message: 'No results found.'};
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
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
        dispatch_id: req.body.dispatch_id
      });
      res.json(newIncident);
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
    }
  })
  .put(async (req, res) => {
    res.send('Action not available.');
  })
  .delete(async (req, res) => {
    res.send('Action unavailable.');
  });
  
router.get('/incidents/on_dates', async (req, res) => {
  try {
    // req.body.startDate req.body.endDate
    console.log(req.query);
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const incidents = await db.incidents.findAll({
      where: {
        date: {
          // [Op.placeholder]: ,
          [Op.between]: [startDate, endDate]
        }
      }
    });
    console.log(incidents);
    // const incident_range = incidents.filter((incident) => {
    //   const date = new Date(incident.date);
    //   return (date >= startDate && date <= endDate);
    // });
    res.json(incidents);
  } catch (err) {
    console.error(err);
    res.error('Server Error!');
  }
});

router.route('/incidents/:incident_id')
  .get(async (req, res) => {
    try {
      const incident = await db.incidents.findAll({
        where: {
          incident_id: req.params.incident_id
        }
      });
      res.json(incident);
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
    }
  })
  .post(async (req, res) => {
    try {
      const newIncident = await db.incidents.create({
        incident_id:  req.params.incident_id,
        date: req.body.date,
        description: req.body.description,
        postal_code: req.body.postal_code,
        district_code: req.body.district_code,
        call_id: req.body.call_id,
        dispatch_id: req.body.dispatch_id
      });
      res.json(newIncident);
    } catch (err) {
      console.error(err);
      res.error('Server Error!');
    }
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
      res.error('Server Error!');
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
      res.error('Server Error!');
    }
  });

router.route('/incidents/:incident_id/units')
  .get(async (req, res) => {
    try {
      const hasUnits = await db.incidents_has_units.findAll({
        where: {
          incidents_incident_id: req.params.incident_id
        }
      });

      const unit_numbers = hasUnits.map((unit) => {
        return unit.unit_number;
      });
      console.log(unit_numbers);
      const allUnits = await db.units.findAll({
        where: {
          unit_number: {
            [Op.in]: unit_numbers
          }
        }
      });
      const reply = getReply(allUnits);
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.send(err);
    }
    // res.send('Action not available');
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

router.route('/incidents/:incident_id/dispatch')
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

// CALLS
router.route('/calls')
  .get(async (req, res) => {
    try {
      const calls = await db.calls.findAll();
      reply = getReply(calls);
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

  // router.route('/')
  // .get(async (req, res) => {
  //   res.send('Action not available');
  // })
  // .post(async (req, res) => {
  //   res.send('Action not available.');
  // })
  // .put(async (req, res) => {
  //   res.send('Action not available.');
  // })
  // .delete(async (req, res) => {
  //   res.send('Action unavailable.');
  // });
  

router.post('/calls/:call_id', async(req, res) => {
  try {
    const call = await db.calls.create({
    });
  } catch (err) {
    console.error(err);
    res.error('Server Error!');
  }
});

// Employees
router.route('/employees')
  .get(async (req, res) => {
    try {
      const all_employees = await db.employees.findAll();
      const reply  = all_employees.length > 0 ? {data: all_employees} : {message: 'No results found.'};
      res.json(reply);
    } catch (err) {
      console.error(err);
      res.send('Server Error!');
    }
    // res.send('Action not available');
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