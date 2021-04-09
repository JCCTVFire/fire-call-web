export default (database, DataTypes) => {
  const Incidents = database.define(
    'incidents',
    {
      incident_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true   
      },
      date: {
        type: DataTypes.DATE,
      },
      description: {
        type: DataTypes.TEXT
      },
      postal_code: {
        type: DataTypes.STRING
      },
      district_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      call_id: {
        type: DataTypes.INTEGER,
        // allowNull: false
      },
      dispatch_id: {
        type: DataTypes.INTEGER
      }
    },
    {
      freezeTableName: true, timestamps: false
    }
  );

  Incidents.associate = function (db) {
    Incidents.hasOne(db.calls, {foreignKey: 'call_id'});

    db.calls.belongsTo(Incidents, {foreignKey: 'call_id'});

    Incidents.hasOne(db.dispatch, {foreignKey: 'dispatch_id'});

    db.dispatch.belongsTo(Incidents, {foreignKey: 'dispatch_id'});
  }
  return Incidents;
}