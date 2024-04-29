'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class service_type extends Model {
    static associate(models) {
      service_type.hasMany(models.service);
    }
  }
  service_type.init({
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
      unique: true,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at'
    },
    deletedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    sequelize,
    modelName: 'service_type',
    underscored: true,
  });

  return service_type;
};