export default (database, DataTypes) => {
  const UnitClass = database.define(
    'unit_class',
    {
      unit_class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      unit_class_name: {
        type: DataTypes.STRING
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
  return UnitClass;
}