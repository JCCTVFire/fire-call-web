export default (database, DataTypes) => {
    const Locations = database.define(
      'locations',
      {
        locations_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        lat: {
          type: DataTypes.DECIMAL
        },
        long: {
          type: DataTypes.DECIMAL
        }
      },
      {
        freezeTableName: true, 
        timestamps: false,
        underscored: true
      }
    );
  
    Locations.associate = function (db) {
      Locations.hasOne(db.incidents, {foreignKey: 'locations_id', sourceKey: 'locations_id', as: 'location'});
    }; 
    return Locations;
  }
