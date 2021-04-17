import sequelize from 'sequelize';

import calls from './calls.js';
import dispatch from './dispatch.js';

import incidents from './incidents.js'; // Parent of calls and dispatch. Must be defined first.
import jurisdiction from './jurisdiction.js';

import stations from './stations.js';
import employees from './employees';



export default {
    calls,
    dispatch,
    incidents, 
    jurisdiction,
    stations,
    employees
}