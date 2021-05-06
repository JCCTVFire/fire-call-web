import db from '../database/initDB.js';
import sequelize from 'sequelize';
import {getReply} from './getReply.js';

const Op = sequelize.Op

async function parseDate(queryDate, minOrMax) {
  try {
    const result = isNaN(queryDate) | queryDate === '' ? await db.incidents.findAll({ attributes: [[sequelize.fn(minOrMax, sequelize.col('date')), 'date']] }) : Date.parse(`${queryDate}T00:00:00-00:00Z`);
    
    return result[0].dataValues.date;
  } catch (err) {
    if (minOrMax !== 'min' | minOrMax !== 'max') {
      console.error('parseDate: minOrMax only accepts "min" and "max" as arguments.')
    } else {
      console.error(err);
      res.json({error: 'Server error'});
    }
  }
}

async function getMatchingCalls (qTextVariants) {
  const calls = await db.calls.findAll({
    where: {
      [Op.or]: [
        {
          call_type: {
            [Op.substring]: qTextVariants.upperCase
          } 
        },
        {
          call_class: {
            [Op.like]: qTextVariants.firstLetterCapitalized
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
    const qTextUpper = qText !== '' ? qText.toUpperCase() : '';
    const qTextLower = qText !== '' ?qText.toLowerCase() : '';

    const qTextWords = qText.split(' ');
    const qTextWordsTitleCase = qTextWords.map((word) => {
      try {
        return word[0].toUpperCase().concat(word.slice(1).toLowerCase());
      } catch (err) {
        return '';
      }
    });
    const qTextTitleCase = qTextWordsTitleCase.join(' ');

    const qTextFirstLetterCapitalized = qText !== '' ? qText[0].toUpperCase().concat(qText.slice(1).toLowerCase()) : '';
    
    const qTextVariants = {
      raw: qText,
      titleCase: qTextTitleCase,
      upperCase: qTextUpper,
      lowerCase: qTextLower,
      firstLetterCapitalized: qTextFirstLetterCapitalized
    }

    const matchCalls = await getMatchingCalls(qTextVariants);
    if (!(isNaN(matchCalls))) {
      const callIDs = matchCalls.map((call) => {
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
      callsToIncidents.map((call) => {
        incidentIDs.push(call.dataValues.incident_id);
        a += 1;
      });
      
    }
    const matchUnits = await db.units.findAll({
      limit: 10,
      where: {
        [Op.or]: [
          {
            unit_number: {
              [Op.substring]: qTextVariants.upperCase
            }
          },
          {
            unit_class_name: {
              [Op.substring]: qTextVariants.titleCase
            }
          }
        ]
      }
    });
    
    let unitsToIncidents = [];
    
    if (matchUnits.length > 0) {
      const unitIDs = matchUnits.map((unit) => {
        return unit.dataValues.unit_id
      });

      unitsToIncidents = await db.incidents.findAll({ where: { unit_id: { [Op.in]: unitIDs } }, limit: 10 });
      let b = 0;
      unitsToIncidents.forEach((unit) => {
        incidentIDs.push(unit.dataValues.incident_id);
        b += 1;
      });
      
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
    res.json({error: 'Server error'});
  }
}

export {
  getSearchResults
};