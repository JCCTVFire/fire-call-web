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

async function getMatchingCalls(qTextVariants) {
  const calls = await db.calls.findAll({
    where: {
      [Op.or]: [
        {
          call_type: {
            [Op.substring]: qTextVariants.raw
          } 
        },
        {
          call_type: {
            [Op.substring]: qTextVariants.upperCase
          } 
        },
        {
          call_type: {
            [Op.substring]: qTextVariants.titleCase
          } 
        },
        {
          call_type: {
            [Op.substring]: qTextVariants.lowerCase
          } 
        },
        {
          call_class: {
            [Op.substring]: qTextVariants.raw
          } 
        },
        {
          call_class: {
            [Op.substring]: qTextVariants.upperCase
          } 
        },
        {
          call_class: {
            [Op.substring]: qTextVariants.titleCase
          } 
        },
        {
          call_class: {
            [Op.substring]: qTextVariants.lowerCase
          } 
        },
      ]
    }
  });

  // let callTypeScores = [];
  // let callClassScores = [];
  // console.log(qTextVariants.lowerCase);
  

  // // console.log(calls);
  // calls.forEach((call) => {
  //   const resultCallClass = call.dataValues.call_class.split('');
  //   const resultCallType = call.dataValues.call_type.split('');
  //   const resultID = call.dataValues.call_id;
    
  //   const matchFirstClassLetter = resultCallClass[0].toLowerCase() === qTextVariants.lowerCase[0] ? 1 : 0;
  //   const classScoreNumerator = resultCallClass.reduce(matchLetter, 0);
  //   const classScore = classScoreNumerator / qTextVariants.lowerCase.length;
  //   callClassScores.push({callID: resultID, score: classScore});
    
  //   const matchFirstTypeLetter = resultCallType[0].toLowerCase() === qTextVariants.lowerCase[0] ? 1 : 0;
  //   const typeScoreNumerator = resultCallType.reduce(matchLetter, 0);
  //   const typeScore = typeScoreNumerator / qTextVariants.lowerCase.length;
  //   callTypeScores.push({callID: resultID, score: typeScore});
  // });

  // callClassScores.sort((x, y) => (x.score < y.score) ? 1 : -1);
  // callTypeScores.sort((x, y) => (x.score < y.score) ? 1 : -1);
  // console.log(callTypeScores[0], callClassScores[0]);

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

    // function matchLetter(acc, letter, pos, array) {
    //   // console.log(letter.toLowerCase(), qTextVariants.lowerCase[pos]);
    //   if (letter.toLowerCase() === qTextVariants.lowerCase[pos]) {
    //     console.log('Match!');
    //     return acc + 1;
    //   } else {
    //     return acc;
    //   }
    // }
    
    // async function getScores(result, att) {
    //   const resultArr = result.split('');
    //   const scoreNumerator = resultArr.reduce(matchLetter, 0);
    //   const resultScore = scoreNumerator / qText.length;
    //   return {attribute: att, score: resultScore };
    // }


    const matchCalls = await getMatchingCalls(qTextVariants);
    if (matchCalls.length > 0) {
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
              [Op.or]: [
                {
                  [Op.like]: qTextVariants.raw
                },
                {
                  [Op.substring]: qTextVariants.raw
                }
              ]
            } 
          },
          {
            unit_number: {
              [Op.substring]: qTextVariants.upperCase
            } 
          },
          {
            unit_number: {
              [Op.substring]: qTextVariants.titleCase
            } 
          },
          {
            unit_number: {
              [Op.substring]: qTextVariants.lowerCase
            } 
          },
          {
            unit_class_name: {
              [Op.or]: [
                {
                  [Op.like]: qTextVariants.raw
                },
                {
                  [Op.substring]: qTextVariants.raw
                }
              ]
            } 
          },
          {
            unit_class_name: {
              [Op.substring]: qTextVariants.upperCase
            } 
          },
          {
            unit_class_name: {
              [Op.substring]: qTextVariants.titleCase
            } 
          },
          {
            unit_class_name: {
              [Op.substring]: qTextVariants.lowerCase
            } 
          },
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
                  [Op.or]: [
                    {
                      [Op.like]: qTextVariants.raw
                    },
                    {
                      [Op.substring]: qTextVariants.raw
                    }
                  ]
                } 
              },
              {
                description: {
                  [Op.or]: [
                    {
                      [Op.like]: qTextVariants.upperCase
                    },
                    {
                      [Op.substring]: qTextVariants.upperCase
                    }
                  ]
                } 
              },
              {
                description: {
                  [Op.or]: [
                    {
                      [Op.like]: qTextVariants.titleCase
                    },
                    {
                      [Op.substring]: qTextVariants.titleCase
                    }
                  ]
                } 
              },
              {
                description: {
                  [Op.or]: [
                    {
                      [Op.like]: qTextVariants.lowerCase
                    },
                    {
                      [Op.substring]: qTextVariants.lowerCase
                    }
                  ]
                } 
              },
              {
                postal_code: {
                  [Op.substring]: qText
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