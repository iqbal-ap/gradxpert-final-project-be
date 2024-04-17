'use strict';
const {
  Model
} = require('sequelize');
const { IsEmail } = require('@sequelize/validator.js');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      IsEmail,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      allowNull: false,
      defaultValue: 'user',
    },
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};