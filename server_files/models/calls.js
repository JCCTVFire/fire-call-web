export default (database, DataTypes) => {
  const Calls = database.define(
    'calls',
    {
      call_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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
    }
  );

  // Calls.associate = function (db) {
  //   Calls.belongsTo(db.incidents);
  // }; 
  return Calls;
}