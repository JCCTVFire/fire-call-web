export default {
  development: {
    username: 'api', // Replace with values for own local mysql database. DO NOT use class VLC for development right now to avoid data corruption.
    password: 'mytester1!', // same as above
    database: 'sql_wizards_va_fire', // same as above
    host: 'localhost',
    dialect: 'mysql'
  },
  test: { // Not used
    username: 'api',
    password: 'mytester1!',
    database: 'sql_wizards_va_fire',
    host: 'localhost',
    dialect: 'mysql'
  }, 
  production: { // Do not change
    username: 'student',
    password: 'INST377@UMD',
    database: 'jcctv_fire',
    host: '3.236.243.212',
    dialect: 'mysql'
  }
};
  