export default (database, DataTypes) => {
  const IncidentsHasUnits = database.define(
    'incidents_has_units',
    {
      incidents_incident_id: {
        type: DataTypes.INTEGER
      },
      units_unit_number: {
        type: DataTypes.INTEGER
      },
      incident_unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
    },
    {
      freezeTableName: true, 
      timestamps: false,
    }
  );

  // Calls.associate = function (db) {
  //   Calls.belongsTo(db.incidents);
  // }; 
  return IncidentsHasUnits;
}