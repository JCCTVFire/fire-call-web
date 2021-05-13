export default (database, DataTypes) => {
  const Incidents = database.define(
    'incidents',
    {
      incident_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
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
        type: DataTypes.STRING  
      },
      call_id: {
        type: DataTypes.INTEGER,
        // allowNull: false
      },
      dispatch_id: {
        type: DataTypes.INTEGER,
        // allowNull: false
      },
      unit_id: {
        type: DataTypes.INTEGER,
        // allowNull: false
      },
      locations_id: {
        type: DataTypes.INTEGER,
      }
    },
    {
      freezeTableName: true, timestamps: false, underscored: true
    }
  );

  Incidents.associate = function (db) {
    Incidents.belongsTo(db.locations, {foreignKey: 'locations_id', sourceKey: 'locations_id', as: 'location'});
    Incidents.belongsTo(db.calls, {foreignKey: 'call_id', sourceKey: 'call_id', as: 'call'});
    Incidents.belongsTo(db.dispatch, {foreignKey: 'dispatch_id', sourceKey: 'dispatch_id', as: 'dispatch'});
    Incidents.belongsTo(db.units, {foreignKey: 'unit_id', sourceKey: 'unit_id', as: 'unit', onUpdate: 'NO ACTION', onDelete: 'NO ACTION'});
  }
  return Incidents;
}