'use strict';

/** @type {import('sequelize-cli').Migration} */
const tableName = 'service_types'
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
       name: 'Service Type 1',
       created_at: new Date(),
       updated_at: new Date(),
     },
     {
       name: 'Service Type 2',
       created_at: new Date(),
       updated_at: new Date(),
     },
     {
       name: 'Service Type 3',
       created_at: new Date(),
       updated_at: new Date(),
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
