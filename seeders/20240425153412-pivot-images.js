'use strict';

const tableName = 'pivotImages';
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
    await queryInterface.bulkInsert(tableName, [
      // * Add default image to user
      {
        imageId: 1,
        pivotImgId: 1,
      },
      // * Add Rumah Sakit Sentosa images
      {
        imageId: 2,
        pivotImgId: 2,
      },
      {
        imageId: 3,
        pivotImgId: 2,
      },
      {
        imageId: 4,
        pivotImgId: 2,
      },
      {
        imageId: 5,
        pivotImgId: 2,
      },
      // * Add Rumah Sakit Bintang Sejahtera images
      {
        imageId: 6,
        pivotImgId: 3,
      },
      {
        imageId: 7,
        pivotImgId: 3,
      },
      {
        imageId: 8,
        pivotImgId: 3,
      },
      {
        imageId: 9,
        pivotImgId: 3,
      },
      // * Add Rumah Sakit Cemerlang Abadi images
      {
        imageId: 10,
        pivotImgId: 4,
      },
      {
        imageId: 11,
        pivotImgId: 4,
      },
      {
        imageId: 12,
        pivotImgId: 4,
      },
      {
        imageId: 13,
        pivotImgId: 4,
      },
      // * Add Apotik Sehat Sentosa images
      {
        imageId: 14,
        pivotImgId: 5,
      },
      {
        imageId: 15,
        pivotImgId: 5,
      },
      {
        imageId: 16,
        pivotImgId: 5,
      },
      {
        imageId: 17,
        pivotImgId: 5,
      },
      // * Add Apotik Harmoni Sejahtera images
      {
        imageId: 18,
        pivotImgId: 6,
      },
      {
        imageId: 19,
        pivotImgId: 6,
      },
      {
        imageId: 20,
        pivotImgId: 6,
      },
      {
        imageId: 21,
        pivotImgId: 6,
      },
      // * Add Apotik Maju Jaya Farma images
      {
        imageId: 22,
        pivotImgId: 7,
      },
      {
        imageId: 23,
        pivotImgId: 7,
      },
      {
        imageId: 24,
        pivotImgId: 7,
      },
      {
        imageId: 25,
        pivotImgId: 7,
      },
      // * Add Laboratorium Sehat Sentosa images
      {
        imageId: 26,
        pivotImgId: 8,
      },
      {
        imageId: 27,
        pivotImgId: 8,
      },
      {
        imageId: 28,
        pivotImgId: 8,
      },
      {
        imageId: 29,
        pivotImgId: 8,
      },
      // * Add Laboratorium Harmoni Sejahtera images
      {
        imageId: 30,
        pivotImgId: 9,
      },
      {
        imageId: 31,
        pivotImgId: 9,
      },
      {
        imageId: 32,
        pivotImgId: 9,
      },
      {
        imageId: 33,
        pivotImgId: 9,
      },
      // * Add Laboratorium Maju Jaya Medika images
      {
        imageId: 34,
        pivotImgId: 10,
      },
      {
        imageId: 35,
        pivotImgId: 10,
      },
      {
        imageId: 36,
        pivotImgId: 10,
      },
      {
        imageId: 37,
        pivotImgId: 10,
      },
      // * Add Klinik Sehat Sentosa images
      {
        imageId: 38,
        pivotImgId: 11,
      },
      {
        imageId: 39,
        pivotImgId: 11,
      },
      {
        imageId: 40,
        pivotImgId: 11,
      },
      {
        imageId: 41,
        pivotImgId: 11,
      },
      // * Klinik Harmoni Sejahtera images
      {
        imageId: 42,
        pivotImgId: 12,
      },
      {
        imageId: 43,
        pivotImgId: 12,
      },
      {
        imageId: 44,
        pivotImgId: 12,
      },
      {
        imageId: 45,
        pivotImgId: 12,
      },
      // * Klinik Maju Jaya Medika
      {
        imageId: 46,
        pivotImgId: 13,
      },
      {
        imageId: 47,
        pivotImgId: 13,
      },
      {
        imageId: 48,
        pivotImgId: 13,
      },
      {
        imageId: 49,
        pivotImgId: 13,
      },
      // * Klinik Gigi Sehat Utama
      {
        imageId: 50,
        pivotImgId: 14,
      },
      {
        imageId: 51,
        pivotImgId: 14,
      },
      {
        imageId: 52,
        pivotImgId: 14,
      },
      {
        imageId: 53,
        pivotImgId: 14,
      },
      // * Klinik Gigi Harmoni Senyum
      {
        imageId: 54,
        pivotImgId: 15,
      },
      {
        imageId: 55,
        pivotImgId: 15,
      },
      {
        imageId: 55,
        pivotImgId: 15,
      },
      {
        imageId: 55,
        pivotImgId: 15,
      },
      // * Klinik Gigi Ceria Jaya
      {
        imageId: 56,
        pivotImgId: 16,
      },
      {
        imageId: 57,
        pivotImgId: 16,
      },
      {
        imageId: 58,
        pivotImgId: 16,
      },
      {
        imageId: 59,
        pivotImgId: 16,
      },
    ]);
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
