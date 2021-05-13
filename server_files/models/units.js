export default (database, DataTypes) => {
  const Units = database.define(
    'units',
    {
      unit_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
    Units.hasMany(db.incidents, {foreignKey: 'unit_id', sourceKey: 'unit_id', as: 'unit', onUpdate: 'NO ACTION', onDelete: 'NO ACTION'});
  }

  return Units;
}