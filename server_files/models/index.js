import sequelize from 'sequelize';

import calls from './calls.js';
import dispatch from './dispatch.js';

import incidents from './incidents.js'; // Parent of calls and dispatch. Must be defined first.

export default {
    calls,
    dispatch,
    incidents
}