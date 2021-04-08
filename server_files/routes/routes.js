import express from 'express';

import db from '../database/initDB.js';
import Op from 'sequelize';
const router = express.Router();



// INCIDENTS
router.get('/incidents', async (request, response) => {
  try {
    const all_incidents = await db.incidents.findAll({
      include: [
        {
          model: db.calls
        }
      ]
    });
    const reply = all_incidents.length > 0 ? {data: all_incidents} : {message: 'No results found.'};
    response.json(reply);
  } catch (err) {
    console.error(err);
    response.error('Server Error!');
  }
});

router.get('/incidents/:incident_id', async (request, response) => {
  try {
    const incident = await db.incidents.findAll({
      where: {
        incident_id: request.params.incident_id
      }
    });
    response.json(incident);
  } catch (err) {
    console.error(err);
    response.error('Server Error!');
  }
});

router.get('/incidents/on_dates', async (request, response) => {
  try {
    const incidents = await db.incidents.findAll();

    const startDate = request.body.startDate;
    const endDate = request.body.endDate;

    const incident_range = incidents.filter((incident) => {
      const date = new Date(incident.date);
      return (date >= startDate && date <= endDate);
    });
    response.json(incident_range);
  } catch (err) {
    console.error(err);
    response.error('Server Error!');
  }
});

router.post('/incidents', async (request, response) => {
  try {
    const newIncident = await db.incidents.create({
      incident_id:  request.body.incident_id,
      date: request.body.date,
      description: request.body.description,
      postal_code: request.body.postal_code,
      district_code: request.body.district_code,
      call_id: request.body.call_id,
      dispatch_id: request.body.dispatch_id
    });
    response.json(newIncident);
  } catch (err) {
    console.error(err);
    response.error('Server Error!');
  }
});

router.delete('/incidents/:incident_id', async (request, response) => {
  try {
    await db.incidents.destroy({
      where: {
        incident_id: request.params.incident_id
      }
    });
    response.send('Successful deletion.');
  } catch (err) {
    console.error(err);
    response.error('Server Error!');
  }
});

router.put('/incidents', async (request, response) => {
  try {
    await db.incidents.update({
      date: request.body.date,
      description: request.body.description,
      postal_code: request.body.postal_code,
      district_code: request.body.district
    },
    {
      where: {
        incident_id: request.body.incident_id
      }
    });
    response.send('Successful update.');
  } catch (err) {
    console.error(err);
    response.error('Server Error!');
  }
})


// // Gets the unit from an incident
// router.get('incidents/:incident_id/unit', async (request, response) => {
//   try {
//     const units = await db.incidents.findAll({
//       where: { 
//         incident_id: request.params.incident_id
//       },
//       include: {
//         dispatch,
//         calls
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     response.error('Server Error!');
//   }
// });


// CALLS
router.get('/calls', async(request, response) => {
  try {
    const calls = await db.calls.findAll();
  } catch (err) {
    console.error(err);
    response.error('Server Error!')
  }
});



router.post('/calls/:call_id', async(request, response) => {
  try {
    const call = await db.calls.create({

    });
  } catch (err) {
    console.error(err);
    response.error('Server Error!');
  }
});

export default router;