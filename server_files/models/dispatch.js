export default (database, DataTypes) => {
  const Dispatch = database.define(
    'dispatch',
    {
      dispatch_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      dispatch_time: {
        type: DataTypes.TIME
      },
      arrival_time: {
        type: DataTypes.TIME
      },
      response_time: {
        type: DataTypes.DECIMAL
      },
      arrival_unit: {
        type: DataTypes.STRING
      },
      cleared_time: {
        type: DataTypes.TIME
      }
    },
    {
      freezeTableName: true, timestamps: false, underscored: true
    }
  );

  Dispatch.associate = function (db) {
    Dispatch.hasOne(db.incidents, {foreignKey: 'dispatch_id', sourceKey: 'dispatch_id', as: 'dispatch'});
  }

  return Dispatch;
}