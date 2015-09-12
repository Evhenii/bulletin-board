'use strict';

module.exports = function (sequelize, DataTypes) {
  var Image = sequelize.define('Image', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    item_id: DataTypes.INTEGER,
    image: DataTypes.BLOB
  }, {
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ],
    timestamps: true,
    freezeTableName: true,
    tableName: 'image',
    classMethods: {

    }
  });
  return Image;
};