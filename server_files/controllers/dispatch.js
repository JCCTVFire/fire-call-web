import {getReply} from './getReply.js';
import db from '../database/initDB.js';

async function getAllDispatch(req, res, next) {
  try {
    const allDispatch = await db.dispatch.findAll();
    const reply = getReply(allDispatch);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.json({message: 'Server error'});
  }
}

async function createNewDispatch(req, res, next) {
  try {
    const existing = await db.dispatch.findAll({ where: { dispatch_id: req.body.dispatch_id}});
    
    if (existing.length > 0) {
      res.json({message: `Entry with dispatch_id ${req.body.dispatch_id} already exists!`});
    } else {
      const newDispatch = await db.dispatch.create({
        dispatch_id:  req.body.dispatch_id,
        dispatch_time: req.body.dispatch_time,
        arrival_time: req.body.arrival_time,
        response_time: req.body.response_time,
        arrival_unit: req.body.arrival_unit,
        cleared_time: req.body.cleared_time
      });
      res.send({message: 'Inserted new entry in "dispatch".'});
    }
  } catch (err) {
    console.error(err);
    res.json({message: 'Server error'});
  }
}

async function getDispatch(req, res, next) {
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
    res.json({message: 'Server error'});
  }
}

async function updateDispatch(req, res, next){
  try {
    await db.dispatch.update({
        dispatch_time: req.body.dispatch_time,
        arrival_time: req.body.arrival_time,
        response_time: req.body.response_time,
        arrival_unit: req.body.arrival_unit,
        cleared_time: req.body.cleared_time
    },
    {
      where: {
        dispatch_id: req.params.dispatch_id
      }
    });
    res.json({message: 'Successfully updated an entry in dispatch.'});
  } catch (err) {
    console.error(err);
    res.json({message: 'Server error'});
  }
}

async function deleteDispatch(req, res, next){
  try {
    
    const deleted = await db.dispatch.destroy({
      where: {
        dispatch_id: req.params.dispatch_id
      }
    });
    if (deleted > 0) {
      res.send({message: `Deleted ${deleted} rows in dispatch.`});
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

export {
  getAllDispatch,
  createNewDispatch,
  getDispatch,
  updateDispatch,
  deleteDispatch
}