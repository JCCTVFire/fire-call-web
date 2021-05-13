import {getReply} from './getReply.js';
import db from '../database/initDB.js';

async function getAllCalls(req, res, next) {
  try {
    const allCalls = await db.calls.findAll();
    const reply = getReply(allCalls);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function createNewCall(req, res, next) {
  try {
    // const existing = await db.calls.findAll({ where: { call_id: req.body.call_id } });
    
    // if (existing.length > 0) {
    //   res.json({message: `Entry with call_id ${req.body.call_id} already exists`})
    // } else {
      const newCall = await db.calls.create({
        call_type: req.body.call_type,
        call_class: req.body.call_class,
        call_time: req.body.call_time
      });
      res.json({message: 'Inserted new entry in "calls".'})
    // }
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function getCall(req, res, next) {
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
    res.json({error: 'Server error'});
  }
}

async function updateCall(req, res, next) {
  try {

    const callArr = await db.calls.findAll({
      where: {
        call_id: req.params.call_id
      }
    });
    console.log(req.body)
    const call = callArr[0];
    call.call_type = req.body.call_type;
    call.call_class = req.body.call_class;
    call.call_time = req.body.call_time;
    console.log(call);
    await call.save();
    // await db.calls.update({
    //   call_type: req.body.call_type,
    //   call_class: req.body.call_class,
    //   call_time: req.body.call_time
    // },
    // {
    //   where: {
    //     call_id: req.params.call_id
    //   }
    // });
    res.json({message: 'Successful update.'});
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function deleteCall(req, res, next) {
  try {
    
    const deleted = await db.calls.destroy({
      where: {
        call_id: req.params.call_id
      }
    });
    if (deleted > 0) {
      res.json({message: `Deleted ${deleted} rows in calls.`});
    } else if (deleted === 0) {
      res.json({message: 'No rows deleted.'});
    } else {
      res.json({error: 'Less than 0 results in deleted.'});
    }
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function getIncidentFromCallID(req, res, next) {
  try {
    const incident = await db.incidents.findAll({
      where: {
        call_id: req.params.call_id
      },
      include: ['call', 'dispatch', 'location', 'unit']
    });
    const reply = getReply(incident);
    // console.log(reply)
    res.json(reply)
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

export {
  getAllCalls,
  createNewCall,
  getCall,
  updateCall,
  deleteCall,
  getIncidentFromCallID
}