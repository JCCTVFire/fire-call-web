export default (database, DataTypes) => {
  const Units = database.define(
    'units',
    {
      unit_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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

  // Units.associate = function (db) {
  //   Units.hasMany()
  // }
  return Units;
}