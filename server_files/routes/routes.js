import express from 'express';
import sequelize from 'sequelize';
import db from '../database/initDB.js';
const Op = sequelize.Op;
const router = express.Router();



// INCIDENTS
router.get('/incidents', async (req, res) => {
  try {
    const all_incidents = await db.incidents.findAll({
      include: [
        {
          model: db.calls
        }
      ]
    });
    const reply = all_incidents.length > 0 ? {data: all_incidents} : {message: 'No results found.'};
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.error('Server Error!');
  }
});

router.get('/incidents/:incident_id', async (req, res) => {
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
});

router.post('/incidents/on_dates', async (req, res) => {
  try {
    // req.body.startDate req.body.endDate
    console.log(req.body);
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.startDate);
    const incidents = await db.incidents.findAll({
      where: {
        date: {
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

router.post('/incidents/new', async (req, res) => {
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
});

router.delete('/incidents/delete/:incident_id', async (req, res) => {
  try {
    console.log(req.body)
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

router.put('/incidents/update/:incident_id', async (req, res) => {
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


// // Gets the unit from an incident
// router.get('incidents/:incident_id/unit', async (req, res) => {
//   try {
//     const units = await db.incidents.findAll({
//       where: { 
//         incident_id: req.params.incident_id
//       },
//       include: {
//         dispatch,
//         calls
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.error('Server Error!');
//   }
// });


// CALLS
router.get('/calls', async(req, res) => {
  try {
    const calls = await db.calls.findAll();
  } catch (err) {
    console.error(err);
    res.error('Server Error!')
  }
});



router.post('/calls/:call_id', async(req, res) => {
  try {
    const call = await db.calls.create({

    });
  } catch (err) {
    console.error(err);
    res.error('Server Error!');
  }
});

export default router;