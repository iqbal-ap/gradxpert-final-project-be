'use strict';

require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.bulkInsert('users', [
      {
        username: process.env.ADMIN_USERNAME_1,
        password: process.env.ADMIN_PASSWORD_1,
        email: process.env.ADMIN_EMAIL_1,
        phone_number: process.env.ADMIN_PHONE_NUMBER_1,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: process.env.ADMIN_USERNAME_2,
        password: process.env.ADMIN_PASSWORD_2,
        email: process.env.ADMIN_EMAIL_2,
        phone_number: process.env.ADMIN_PHONE_NUMBER_2,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.bulkDelete('users', null, {});
  }
};
