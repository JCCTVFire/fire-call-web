export default (database, DataTypes) => {
    const Jurisdiction = database.define(
      'jurisdiction',
      {
        jurisdiction_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true
        },
        jurisdiction_name: {
          type: DataTypes.STRING,
        }
      },
      {
        freezeTableName: true, 
        timestamps: false,
      }
    );
  
    return Jurisdiction;
  }
