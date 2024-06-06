'use strict';

const tableName = 'pivotImages';
// * Payload preparation
const payload = [];
for (let i = 1; i < 16; i++) {
  payload.push(
    {
      pivotImgId: i,
      imageId: 2
    },
    {
      pivotImgId: i,
      imageId: 3,
    },
    {
      pivotImgId: i,
      imageId: 3,
    },
    {
      pivotImgId: i,
      imageId: 3,
    },
  )
}
/** @type {import('sequelize-cli').Migration} */
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
    // * Add default images to services
    await queryInterface.bulkInsert(tableName, payload);
    // * Add default image to user
    await queryInterface.bulkInsert(tableName, [{
      pivotImgId: 16,
      imageId: 1,
    }]);
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
