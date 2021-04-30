export default (database, DataTypes) => {
  const Units = database.define(
    'units',
    {
      unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      unit_number: {
        type: DataTypes.INTEGER,
      },
      unit_class_name: {
        type: DataTypes.STRING
      },
      // unit_class_unit_class_id: {
      //   type: DataTypes.INTEGER
      // }
    },
    {
      freezeTableName: true, 
      timestamps: false,
    }
  );

  // Units.associate = function () {
    // db.units.belongsToMany(db.incidents, {through: IncidentsHasUnits});
    // db.incidents.belongsToMany(db.units, {through: IncidentsHasUnits});
  // }
  return Units;
}