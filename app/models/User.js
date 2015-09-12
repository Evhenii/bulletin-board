'use strict';

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    phone: DataTypes.STRING(25),
    name: DataTypes.STRING(50),
    email: DataTypes.STRING(150),
    token: DataTypes.STRING(),
    password: DataTypes.STRING()
  }, {
    indexes: [
      {
        unique: true,
        fields: ['id']
      },
      {
        unique: true,
        fields: ['token']
      }
    ],
    timestamps: false,
    freezeTableName: true,
    tableName: 'user',
    classMethods: {
    }
  });
  return User;
};
