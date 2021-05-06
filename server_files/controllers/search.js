import db from '../database/initDB.js';
import sequelize from 'sequelize';
import {getReply} from './getReply.js';

const Op = sequelize.Op

async function parseDate(queryDate, minOrMax) {
  try {
    const result = isNaN(queryDate) | queryDate === '' ? await db.incidents.findAll({ attributes: [[sequelize.fn(minOrMax, sequelize.col('date')), 'date']] }) : Date.parse(`${queryDate}T00:00:00-00:00Z`);
    // console.log(result[0].dataValues.date);
    return result[0].dataValues.date;
  } catch (err) {
    if (minOrMax !== 'min' | minOrMax !== 'max') {
      console.log('parseDate only accepts "min" or "max" as arguments');
    } else {
      console.log(err);
    }
  }
}

async function getMatchingCalls (qText) {
  const qTextTitleCase = qText[0].toUpperCase().concat(qText.slice(1).toLowerCase());
  const calls = await db.calls.findAll({
    where: {
      [Op.or]: [
        {
          call_type: {
            [Op.substring]: qText.toUpperCase()
          } 
        },
        {
          call_class: {
            [Op.like]: qTextTitleCase
          }
        }
      ]
    },
    limit: 10
  });
  return calls;
}

async function getSearchResults(req, res, next) {
  try {
    // console.log(req)
    let incidentData = [];
    let incidentIDs = [];
    const qText = req.query.queryText;

    const qTextWords = qText.split(' ');
    const qTextWordsTitleCase = qTextWords.map((word) => {
      return word[0].toUpperCase().concat(word.slice(1).toLowerCase());
    });
    const qTextTitleCase = qTextWordsTitleCase.join(' ');

    const matchCalls = await getMatchingCalls(qText);
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
      console.log("Calls:", a);
    }
    const matchUnits = await db.units.findAll({
      where: {
        [Op.or]: [
          {
            unit_number: {
              [Op.substring]: qText.toUpperCase()
            }
          },
          {
            unit_class_name: {
              [Op.substring]: qTextTitleCase
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

    const startDate = await parseDate(req.query.startDate, 'min');
    const endDate = await parseDate(req.query.endDate, 'max');

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
                  [Op.substring]: qText
                } 
              },
              {
                postal_code: {
                  [Op.startsWith]: qText
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