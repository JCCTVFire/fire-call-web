import {getReply} from './getReply.js';
import db from '../database/initDB.js';

async function getAllUnits(req, res, next) {
  try {
    const allUnits = await db.units.findAll();
    const reply = getReply(allUnits);
    res.json(reply);
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function createNewUnit(req, res, next) {
  try {
    // const existing = await db.units.findAll({ where: { unit_id: req.body.unit_id } });
    
    // if (existing.length > 0) {
    //   res.json({message: `Entry with unit_id ${req.body.unit_id} already exists`})
    // } else {
      const newUnits = await db.units.create({
        // unit_id: req.body.unit_id,
        unit_number: req.body.unit_number,
        unit_class_name: req.body.unit_class_name
      });
      res.json({message: 'Inserted new entry in "units".'})
    // }
  } catch (err) {
    console.error(err);
    res.json({error: 'Server error'});
  }
}

async function getUnit(req, res, next) {
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
}

async function updateUnit(req, res, next) {
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
}

async function deleteUnit(req, res, next) {
  try {
    const deleted = await db.units.destroy({
      where: {
        unit_id: req.params.unit_id
      }
    });
    if (deleted > 0) {
      res.json({message: `Deleted ${deleted} rows in units.`});
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

export {
    getAllUnits,
    createNewUnit,
    getUnit,
    updateUnit,
    deleteUnit
}