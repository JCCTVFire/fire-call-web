import sequelize from 'sequelize';

import calls from './calls.js';
import dispatch from './dispatch.js';
import incidents from './incidents.js'; // Parent of calls and dispatch. Must be defined first.

import units from './units.js';

import incidents_has_units from './incidentsHasUnits.js'; // Join table for incidents and units

import jurisdiction from './jurisdiction.js';
import stations from './stations.js';
import employees from './employees.js';

import locations from './locations.js'; // Parent of incidents

export default {
    calls,
    dispatch,
    incidents, 
    jurisdiction,
    units,
    incidents_has_units,
    stations,
    employees,
    locations
}