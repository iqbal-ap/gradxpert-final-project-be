'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class pivotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      pivotImage.belongsTo(models.image)
    }
  }
  pivotImage.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    pivotImgId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    imageId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: {
        model: 'images',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'pivotImage',
  });
  return pivotImage;
};