'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class service extends Model {
    static associate(models) {
      service.belongsTo(models.service_type, {
        foreignKey: 'service_type_id'
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
    },
    address: DataTypes.STRING,
    phoneNumber: {
      type: DataTypes.STRING,
      field: 'phone_number',
    },
    serviceTypeId: {
      type: DataTypes.INTEGER,
      field: 'service_type_id',
      references: {
        model: 'service_types',
        key: 'id',
      },
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      field: 'deleted_at',
    }
  }, {
    sequelize,
    modelName: 'service',
    underscored: true,
  });
  return service;
};