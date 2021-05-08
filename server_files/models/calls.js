export default (database, DataTypes) => {
  const Calls = database.define(
    'calls',
    {
      call_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      call_type: {
        type: DataTypes.STRING
      },
      call_class: {
        type: DataTypes.STRING
      },
      call_time: {
        type: DataTypes.TIME
      }
    },
    {
      freezeTableName: true, 
      timestamps: false,
      underscored: true
    }
  );

  Calls.associate = function (db) {
    Calls.hasOne(db.incidents, { foreignKey: 'call_id', sourceKey: 'call_id', as: 'call'});
  }

  return Calls;
}