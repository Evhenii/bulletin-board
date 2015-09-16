'use strict';

module.exports = function (sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING(),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: {field: "title", message: "Title is empty"}
        }
      }
    },
    price: {
      type: DataTypes.FLOAT(),
      allowNull: false,
      validate: {
        isFloat: {
          msg: {field: "price", message: "Incorrect price value"}
        }
      }
    },
    image: {
      type: DataTypes.STRING()
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ],
    updatedAt: false,
    freezeTableName: true,
    tableName: 'item',
    underscored: true,
    classMethods: {
      associate: function(models) {
        Item.belongsTo(models.User, {
          foreignKey: 'user_id',
          as: 'user'
        })
      }
    }
  });
  return Item;
};