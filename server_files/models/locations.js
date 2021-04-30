export default (database, DataTypes) => {
    const Locations = database.define(
      'locations',
      {
        locations_id: {
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
          type: DataTypes.INTEGER
        }
      },
      {
        freezeTableName: true, 
        timestamps: false,
      }
    );
  
    Locations.associate = function (db) {
      Locations.hasOne(db.incidents, {foreignKey: 'incident_id'});
      db.incidents.belongsTo(Locations, {foreignKey: 'incident_id'});
    }; 
    return Locations;
  }