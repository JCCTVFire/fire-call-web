export default (database, DataTypes) => {
    const Employees = database.define(
      'employees',
      {
        employee_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        employee_first_name: {
          type: DataTypes.STRING
        },
        employee_last_name: {
          type: DataTypes.STRING
        },
        employee_salary: {
          type: DataTypes.INTEGER
        },
        unit_number: {
          type: DataTypes.INTEGER
        },
        station_id: {
          type: DataTypes.INTEGER
        }
      },
      {
        freezeTableName: true, 
        timestamps: false,
      }
    );
  
    // Units.associate = function (db) {
    //   Units.hasMany()
    // }
    return Employees;
  }
