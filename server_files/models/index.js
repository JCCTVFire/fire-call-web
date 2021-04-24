import sequelize from 'sequelize';

import calls from './calls.js';
import dispatch from './dispatch.js';

import incidents from './incidents.js'; // Parent of calls and dispatch. Must be defined first.
import jurisdiction from './jurisdiction.js';

import stations from './stations.js';
import employees from './employees.js';
import units from './units.js'

import incidents_has_units from './incidentsHasUnits.js'

export default {
    calls,
    dispatch,
    incidents, 
    jurisdiction,
    units,
    incidents_has_units,
    stations,
    employees
}