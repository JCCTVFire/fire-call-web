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
        underscored: true
      }
    );
  
    Locations.associate = function (db) {
      Locations.belongsTo(db.incidents, {foreignKey: 'incident_id', sourceKey: 'incidents_incident_id', as: 'incident'});
    }; 
    return Locations;
  }