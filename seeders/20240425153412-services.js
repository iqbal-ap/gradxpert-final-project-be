'use strict';

const tableName = 'services';
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
   await queryInterface.bulkInsert(tableName, [
    {
      name: 'Service 1',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 2',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 3',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 4',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 5',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 6',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 7',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 8',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 9',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 10',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 11',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 12',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 13',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 14',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Service 15',
      description: 'Lorem Ipsum Dolor Amet',
      rating: 0,
      address: 'Lorem Ipsum Dolor Amet',
      phoneNumber: '(0271) 12345',
      serviceTypeId: 1,
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
