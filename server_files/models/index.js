import sequelize from 'sequelize';

import calls from './calls.js'; // done route 
import dispatch from './dispatch.js'; // done route
import units from './units.js'; // done route

import incidents from './incidents.js'; // Parent of calls, units, and dispatch. Must be defined first. // done route

import locations from './locations.js'; // Parent of incidents //issue with the route // done route
//////////// NOT USED ///////////////
import incidents_has_units from './incidentsHasUnits.js'; // Join table for incidents and units
import jurisdiction from './jurisdiction.js';
import stations from './stations.js';
import employees from './employees.js';
/////////////////////////////////////


export default {
    calls,
    dispatch,
    units,
    incidents, 
    locations,
    jurisdiction,
    incidents_has_units,
    stations,
    employees
}