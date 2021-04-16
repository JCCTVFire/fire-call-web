export default (database, DataTypes) => {
  const Dispatch = database.define(
    'dispatch',
    {
      dispatch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      dispatch_time: {
        type: DataTypes.TIME
      },
      arrival_time: {
        type: DataTypes.TIME
      },
      response_time: {
        type: DataTypes.TIME
      },
      arrival_unit: {
        type: DataTypes.INTEGER
      },
      cleared_time: {
        type: DataTypes.TIME
      }
    },
    {
      freezeTableName: true, timestamp: false
    }
  );

  // Dispatch.associate = function (db) {
  //   Dispatch.belongsTo(db.incidents);
  //   // dispatch.hasMany(models.units, { foreignKey: 'arrival_unit' });
  // };
  return Dispatch;
}