'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      review.belongsTo(models.service, {
        foreignKey: 'serviceId'
      });
      review.belongsTo(models.user, {
        foreignKey: 'userId'
      });
    }
  }
  review.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    serviceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'services',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rating: {
      type: DataTypes.REAL,
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      }
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
    },
  }, {
    sequelize,
    modelName: 'review',
  });
  return review;
};