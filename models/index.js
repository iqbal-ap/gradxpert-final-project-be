const fs = require('fs');
const { Sequelize } = require('sequelize');
const {
  database,
  dialect,
  host,
  username,
  password,
  port,
} = require('../config/sequelize.config')[process.env.NODE_ENV];

const sequelize = new Sequelize({
  database,
  dialect,
  host,
  username,
  password,
  port,
  logging: false,
})

const models = {};
const filenames = fs.readdirSync('./models');
filenames.forEach((name, idx) => {
  if (!name.match(/\.js$/)) return;
  if (name === 'index.js') return;
  
  const model = require(`./${name}`)(sequelize, Sequelize.DataTypes);
  models[model.name] = model;
})

Object.keys(models).forEach((key) => {
  if (models[key].associate) {
    models[key].associate(models);
  }
});

models.DbConnection = sequelize;
models.Sequelize = Sequelize;

module.exports = models;