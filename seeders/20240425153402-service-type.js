'use strict';

/** @type {import('sequelize-cli').Migration} */
const tableName = 'serviceTypes'
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert(tableName, [
     {
       name: 'Rumah Sakit',
       createdAt: new Date(),
       updatedAt: new Date(),
     },
     {
       name: 'Laboratorium',
       createdAt: new Date(),
       updatedAt: new Date(),
     },
     {
       name: 'Klinik',
       createdAt: new Date(),
       updatedAt: new Date(),
     },
     {
       name: 'Dental Klinik',
       createdAt: new Date(),
       updatedAt: new Date(),
     },
     {
       name: 'Apotik',
       createdAt: new Date(),
       updatedAt: new Date(),
     },
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(tableName, null, {});
  }
};
