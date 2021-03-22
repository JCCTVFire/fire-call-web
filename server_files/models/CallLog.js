export default (database, DataTypes) => {
  const calls = database.define(
    "calls",
    {
      call_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      call_type: {
        type: DataTypes.STRING(45)
      },
      call_class: {
        type: DataTypes.STRING(45)
      },
      call_time: {
        type: DataTypes.TIME
      }
    },
    {
      freezeTableName: true, timestamps: false
    }
  );
  return calls;
}