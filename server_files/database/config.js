export default {
  development: {
    username: 'student',
    password: 'INST377@UMD',
    database: 'jcctv_fire',
    host: '3.236.243.212',
    dialect: 'mysql',
    define: {
      underscored: true
    }
  },
  test: { // Not used
    username: 'api',
    password: 'mytester1!',
    database: 'sql_wizards_va_fire',
    host: 'localhost',
    dialect: 'mysql',
    define: {
      underscored: true
    }
  }, 
  production: { // Do not change
    username: 'student',
    password: 'INST377@UMD',
    database: 'jcctv_fire',
    host: '3.236.243.212',
    dialect: 'mysql',
    define: {
      underscored: true
    }
  },
  
};
  