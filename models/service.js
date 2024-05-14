'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class service extends Model {
    static associate(models) {
      service.belongsTo(models.serviceType, {
        foreignKey: 'serviceTypeId'
      });
      service.hasMany(models.review);
    }
  }
  service.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.STRING,
    rating: {
      type: DataTypes.REAL,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      }
    },
    address: DataTypes.STRING,
    phoneNumber: {
      type: DataTypes.STRING,
    },
    serviceTypeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'serviceTypes',
        key: 'id',
      },
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'service',
  });
  return service;
};