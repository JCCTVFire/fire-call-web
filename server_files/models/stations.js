export default (database, DataTypes) => {
    const Stations = database.define(
      'stations',
      {
        station_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        station_number: {
          type: DataTypes.INTEGER
        },
        station_budget: {
          type: DataTypes.INTEGER
        },
        jurisdiction_jurisdiction_id: {
          type: DataTypes.INTEGER
        }
      },
      {
        freezeTableName: true, 
        timestamps: false,
      }
    );
  
    // Calls.associate = function (db) {
    //   Calls.belongsTo(db.incidents);
    // }; 
    return Stations;
  }
