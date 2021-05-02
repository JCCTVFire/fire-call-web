export default (database, DataTypes) => {
    const Locations = database.define(
      'locations',
      {
        location_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        lat: {
          type: DataTypes.DECIMAL
        },
        long: {
          type: DataTypes.DECIMAL
        },
        incidents_incident_id: {
          type: DataTypes.INT
        }
      },
      {
        freezeTableName: true, 
        timestamps: false,
      }
    );
  
    Locations.associate = function (db) {
      Locations.hasOne(db.incidents);
      db.incidents.belongsTo(Locations);
    }; 
    return Calls;
  }