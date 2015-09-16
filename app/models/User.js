'use strict';

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    phone: {
      type: DataTypes.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: {field: "phone", message: "Phone not entered"}
        },
        is: {
          args: /^\+?[0-9]{6,25}$/i,
          msg: {field: "phone", message: "Incorrect phone number"}
        }
      }},
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isAlpha: {
          msg: {field: "name", message: "Name should include characters only"}
        },
        len: {
          args: [3, 100],
          msg: {field: "name", message: "Name should be 3 - 100 character long"}
        }
      }
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    validate: {
      isEmail: {
        msg: {field: "email", message: "Incorrect email"}
      },
      notEmpty: {
        msg: {field: "email", message: "Field email is empty"}
      }
    }},
    token: {
      type: DataTypes.STRING(),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(),
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: {field: "password", message: "Field password should have 6 - 255 characters long"}
        }
      },
      get: function() {}
    }
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
