import express from 'express';

import db from '../database/initDB.js';

const router = express.Router();



// INCIDENTS
router.get('/incidents', async (request, response) => {
  try {
    const all_incidents = await db.incidents.findAll({
      include: [
        {
          model: db.calls, 
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

// Gets the unit from an incident
router.get('incidents/:incident_id/unit', async (request, response) => {
  try {
    const units = await db.incidents.findAll({
      include: {

      }
    });
    
  } catch (err) {
    console.error(err);
    response.error('Server Error!');
  }
});


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