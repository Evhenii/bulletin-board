'use strict';

module.exports = function (sequelize, DataTypes) {
  var Item = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING(50),
    price: DataTypes.FLOAT(2),
    image: DataTypes.STRING
  }, {
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ],
    timestamps: true,
    freezeTableName: true,
    tableName: 'item',
    classMethods: {

    }
  });
  return Item;
};