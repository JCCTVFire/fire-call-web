import db from '../database/initDB.js';
import sequelize from 'sequelize';
import {getReply} from './getReply.js';

const Op = sequelize.Op

async function getSearchResults(res, req, next) {
  try {
    // console.log(req)
    let replyData = []
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
      }
    });
    let callsToIncidents;
    if (matchCalls !== 'undefined') {
      const call_ids = matchCalls.map((call) => {
        // console.log(call.dataValues.call_id);
        return call.dataValues.call_id;
      });
      callsToIncidents = await db.incidents.findAll({
        where: {
          call_id: {
            [Op.in]: call_ids
          }
        }
      })
    }
    
    console.log(`${req.query.endDate} 23:59:59`)
    const startDate = Date.parse(`${req.query.startDate}T00:00:00-00:00`);
    const endDate = Date.parse(`${req.query.endDate}T23:59:59-00:00`);

    const matchIncidents = await db.incidents.findAll({
      where: {
        [Op.and]: [{
          [Op.or]: [
            { description: {
              [Op.startsWith]: req.query.queryText
            } },
            { postal_code: {
              [Op.startsWith]: req.query.queryText
            } },
          ]},
          {
            date: {
              [Op.between]: [startDate, endDate]
            }
          }
      ]}
    });
    console.log(matchIncidents);
    const incidentData = matchIncidents + callsToIncidents;
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