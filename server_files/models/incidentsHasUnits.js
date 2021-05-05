export default (database, DataTypes) => {
  const IncidentsHasUnits = database.define(
    'incidents_has_units',
    {
      incident_unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      incidents_incident_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      units_unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    },
    {
      freezeTableName: true, 
      timestamps: false,
    }
  );
  IncidentsHasUnits.associate = function (db) {
    db.units.belongsToMany(db.incidents, {through: IncidentsHasUnits, foreignKey: 'units_unit_id'});
    db.incidents.belongsToMany(db.units, {through: IncidentsHasUnits, foreignKey: 'incidents_incident_id'});
  }

  return IncidentsHasUnits;
}