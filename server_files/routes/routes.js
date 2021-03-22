/* eslint-disable no-console*/
import express from 'express';
import sequelize from 'sequelize';

import db from '../database/initDB.js';

const router = express.Router();

router.get('/calls', async (request, response) => {
  try {
    const all_calls = await db.calls.findAll();
    const reply = all_calls.length > 0 ? {data: all_calls} : {message: 'No results found.'};
    response.json(reply);
  } catch (err) {
    console.error(err);
    response.error('Server Error!');
  }
});

router.get('/calls/:call_id', async (request, response) => {
  try {
    const call = await db.calls.findAll({
      where: {
        call_id: request.params.call_id
      }
    });
    response.json(call);
  } catch (err) {
    console.error(err);
    response.error('Server Error!');
  }
});

export default router;