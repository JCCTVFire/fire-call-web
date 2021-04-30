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
      unit_class_unit_class_id: {
        type: DataTypes.INTEGER
      }
    },
    {
      freezeTableName: true, 
      timestamps: false,
    }
  );

  Units.associate = function () {
    Units.belongsToMany(db.incidents, {through: db.incidents_has_units});
    db.incidents.belongsToMany(Units, {through: db.incidents_has_units});
  }
  return Units;
}