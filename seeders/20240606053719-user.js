'use strict';

require('dotenv').config();
const bycrpt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('users', [
      {
        username: process.env.ADMIN_USERNAME_1,
        password: await bycrpt.hash(process.env.ADMIN_PASSWORD_1, Number(process.env.SALT)),
        email: process.env.ADMIN_EMAIL_1,
        phoneNumber: process.env.ADMIN_PHONE_NUMBER_1,
        role: 'admin',
        pivotImgId: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: process.env.ADMIN_USERNAME_2,
        password: await bycrpt.hash(process.env.ADMIN_PASSWORD_2, Number(process.env.SALT)),
        email: process.env.ADMIN_EMAIL_2,
        phoneNumber: process.env.ADMIN_PHONE_NUMBER_2,
        role: 'admin',
        pivotImgId: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'ordinary-user',
        password: await bycrpt.hash(process.env.ADMIN_PASSWORD_2, Number(process.env.SALT)),
        email: 'ordinary-user@gmail.com',
        phoneNumber: process.env.ADMIN_PHONE_NUMBER_2,
        role: 'user',
        pivotImgId: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('users', null, {});
  }
};
