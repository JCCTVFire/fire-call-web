import db from '../database/initDB.js';
import sequelize from 'sequelize';
import {getReply} from './getReply.js';

const Op = sequelize.Op

async function getSearchResults(req, res, next) {
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
    let resultCount = 10;
    try {
      resultCount = JSON.parse(req.query.limit);
    } catch (err) {
      resultCount = 10;
    }
    console.log(`${req.query.endDate} 23:59:59`);
    const startDate = Date.parse(`${req.query.startDate}T00:00:00-00:00`);
    const endDate = Date.parse(`${req.query.endDate}T23:59:59-00:00`);

    const matchIncidents = await db.incidents.findAll({
      attributes: ['incident_id', 'date', 'description', 'postal_code', 'district_code'],
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
                  [Op.like]: req.query.queryText
                } 
              },
              {
                postal_code: {
                  [Op.like]: req.query.queryText
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
      limit: resultCount,
      include: [
        {
          model: db.calls,
          as: 'call'

        },
        {
          model: db.units,
          as: 'unit'
        },
        {
          model: db.dispatch,
          as: 'dispatch'
        },
        {
          model: db.locations,
          as: 'location'
        }
      ]
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
}

export {
  getSearchResults
};