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
      dispach_id: {
        type: DataTypes.INTEGER
      }
    },
    {
      freezeTableName: true, timestamps: false
    }
  );

  Incidents.associate = function (db) {
    Incidents.hasMany(db.calls, {
      foreignKey: 'call_id'
    });

    db.calls.belongsTo(Incidents);

    Incidents.hasOne(db.dispatch, {
      foreignKey: 'dispatch_id'
    });

    db.dispatch.belongsTo(Incidents);
  }
  return Incidents;
}