'use strict';

const tableName = 'images';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
        description: 'Default user image',
        url: 'https://picsum.photos/id/64/500',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Default service main image',
        url: 'https://www.apotek-k24.com/images/post/16777494720230211014631yunita.isnaciri-ciri%20pengusaha%20yang%20berhasil.jpg.webp',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Default service submain image',
        url: 'https://images.theconversation.com/files/369567/original/file-20201116-23-18wlnv.jpg?ixlib=rb-4.1.0&q=20&auto=format&w=320&fit=clip&dpr=2&usm=12&cs=strip',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete(tableName, null, {});
  }
};
