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
      }
    },
    {
      freezeTableName: true, 
      timestamps: false,
      underscored: true
    }
  );

  Units.associate = function (db) {
    Units.hasOne(db.incidents, {foreignKey: 'unit_id', sourceKey: 'unit_id', as: 'unit'});
  }

  return Units;
}