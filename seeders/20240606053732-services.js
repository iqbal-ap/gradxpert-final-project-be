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
      name: 'Rumah Sakit Sentosa',
      description: 'Merupakan pusat kesehatan unggulan dengan reputasi yang terpercaya. Didirikan dengan fokus pada perawatan holistik dan inovatif, Rumah Sakit Sentosa menyediakan layanan medis komprehensif dengan standar tertinggi. Fasilitas modern dan tim medis berpengalaman siap memberikan perawatan yang personal dan efektif bagi setiap pasien. Dari diagnosis hingga penyembuhan, setiap langkah diarahkan untuk memastikan kesembuhan dan kenyamanan pasien. Dengan komitmen pada keunggulan dan kepedulian, Rumah Sakit Sentosa menjadi pilihan terkemuka bagi mereka yang mencari perawatan kesehatan terbaik.',
      rating: 0,
      address: 'Jl. Mawar Indah No. 10, Kota Bahagia, Provinsi Sentosa',
      phoneNumber: '+621234567890',
      serviceTypeId: 1,
      pivotImgId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Rumah Sakit Bintang Sejahtera',
      description: 'Menawarkan pendekatan holistik dalam perawatan kesehatan, Rumah Sakit Bintang Sejahtera mengintegrasikan aspek medis, psikologis, dan spiritual. Dikelola oleh tim profesional yang peduli, rumah sakit ini menciptakan lingkungan penyembuhan yang nyaman dan terapeutik bagi pasien. Dengan fokus pada kesejahteraan menyeluruh, mereka menyediakan perawatan yang personal dan terkoordinasi.',
      rating: 0,
      address: 'Jl. Melati Damai Blok C2, Kecamatan Sejahtera, Kota Harmoni, Provinsi Sentosa',
      phoneNumber: '+621234567891',
      serviceTypeId: 1,
      pivotImgId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Rumah Sakit Cemerlang Abadi',
      description: 'Sebagai pusat kegawatdaruratan terkemuka, Rumah Sakit Cemerlang Abadi menonjol dalam penanganan kondisi medis yang kompleks. Didukung oleh teknologi mutakhir dan tim spesialis terlatih, mereka memberikan perawatan berkualitas tinggi dengan efisiensi maksimal. Dari keadaan darurat hingga pemulihan, rumah sakit ini memprioritaskan keselamatan dan kesembuhan pasien dengan komitmen tak tergoyahkan.',
      rating: 0,
      address: 'Jl. Terang Budi No. 88, Kelurahan Cemerlang, Kota Maju Jaya, Provinsi Sentosa',
      phoneNumber: '+621234567892',
      serviceTypeId: 1,
      pivotImgId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Apotik Sehat Sentosa',
      description: 'Menyediakan beragam kebutuhan obat dan produk kesehatan dengan layanan yang ramah dan profesional. Apotik Sehat Sentosa berkomitmen untuk memenuhi kebutuhan kesehatan masyarakat dengan menyediakan produk berkualitas dan informasi yang akurat.',
      rating: 0,
      address: 'Jl. Anggrek No. 5, Kota Bahagia, Provinsi Sentosa',
      phoneNumber: '+621234567890',
      serviceTypeId: 5,
      pivotImgId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Apotik Harmoni Sejahtera',
      description: 'Memberikan layanan farmasi yang komprehensif dengan stok obat yang lengkap dan konsultasi apoteker yang terpercaya. Apotik Harmoni Sejahtera berkomitmen untuk memastikan pasien mendapatkan perawatan yang terbaik untuk kesehatan mereka.',
      rating: 0,
      address: 'Jl. Raya Damai No. 12, Kecamatan Sejahtera, Kota Harmoni, Provinsi Sentosa',
      phoneNumber: '+621234567891',
      serviceTypeId: 5,
      pivotImgId: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Apotik Maju Jaya Farma',
      description: 'Merupakan apotik yang terdepan dalam inovasi layanan farmasi dengan teknologi terbaru. Apotik Maju Jaya Farma menyediakan obat-obatan terkini dan layanan konsultasi farmasi yang profesional untuk kebutuhan kesehatan yang optimal.',
      rating: 0,
      address: 'Jl. Cerdas Makmur No. 20, Kelurahan Maju Jaya, Kota Maju Jaya, Provinsi Sentosa',
      phoneNumber: '+621234567892',
      serviceTypeId: 5,
      pivotImgId: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Laboratorium Sehat Sentosa',
      description: 'Menyediakan layanan uji laboratorium komprehensif untuk diagnosis penyakit dengan akurasi tinggi. Laboratorium Sehat Sentosa dilengkapi dengan peralatan mutakhir dan dijalankan oleh tim ahli laboratorium yang berpengalaman. Mereka berkomitmen untuk memberikan hasil yang tepat waktu dan terpercaya kepada pasien.',
      rating: 0,
      address: 'Jl. Anggrek No. 5, Kota Bahagia, Provinsi Sentosa',
      phoneNumber: '+621234567890',
      serviceTypeId: 2,
      pivotImgId: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Laboratorium Harmoni Sejahtera',
      description: 'Spesialis dalam pemeriksaan laboratorium untuk mendukung diagnosis dan pengobatan penyakit. Laboratorium Harmoni Sejahtera menawarkan layanan uji yang lengkap dan akurat dengan peralatan modern dan tim ahli yang kompeten.',
      rating: 0,
      address: 'Jl. Raya Damai No. 12, Kecamatan Sejahtera, Kota Harmoni, Provinsi Sentosa',
      phoneNumber: '+621234567891',
      serviceTypeId: 2,
      pivotImgId: 9,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Laboratorium Maju Jaya Medika',
      description: 'Merupakan laboratorium terkemuka yang menyediakan berbagai layanan uji laboratorium dengan keandalan tinggi. Dilengkapi dengan teknologi terbaru dan tim ahli yang terlatih, Laboratorium Maju Jaya Medika siap memberikan hasil yang akurat dan terpercaya kepada pasien.',
      rating: 0,
      address: 'Jl. Cerdas Makmur No. 20, Kelurahan Maju Jaya, Kota Maju Jaya, Provinsi Sentosa',
      phoneNumber: '+621234567892',
      serviceTypeId: 2,
      pivotImgId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Klinik Sehat Sentosa',
      description: 'Menyediakan layanan kesehatan primer dan pemeriksaan umum dengan tenaga medis yang berkualitas. Klinik Sehat Sentosa berkomitmen untuk memberikan perawatan yang ramah, terjangkau, dan berkualitas kepada masyarakat.',
      rating: 0,
      address: 'Jl. Anggrek No. 5, Kota Bahagia, Provinsi Sentosa',
      phoneNumber: '+621234567890',
      serviceTypeId: 3,
      pivotImgId: 11,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Klinik Harmoni Sejahtera',
      description: 'Klinik yang menyediakan layanan kesehatan umum dengan dokter dan perawat yang berpengalaman. Klinik Harmoni Sejahtera memprioritaskan pelayanan yang cepat, efisien, dan terjangkau bagi pasien.',
      rating: 0,
      address: 'Jl. Raya Damai No. 12, Kecamatan Sejahtera, Kota Harmoni, Provinsi Sentosa',
      phoneNumber: '+621234567891',
      serviceTypeId: 3,
      pivotImgId: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Klinik Maju Jaya Medika',
      description: 'Klinik yang menawarkan pelayanan kesehatan komprehensif dengan berbagai spesialisasi. Dilengkapi dengan fasilitas modern dan tenaga medis yang terlatih, Klinik Maju Jaya Medika siap memberikan perawatan yang terbaik kepada pasien.',
      rating: 0,
      address: 'Jl. Cerdas Makmur No. 20, Kelurahan Maju Jaya, Kota Maju Jaya, Provinsi Sentosa',
      phoneNumber: '+621234567892',
      serviceTypeId: 3,
      pivotImgId: 13,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Klinik Gigi Sehat Utama',
      description: 'Menawarkan berbagai layanan perawatan gigi dan mulut dengan teknologi mutakhir dan tim dokter gigi terampil. Klinik Gigi Sehat Utama berkomitmen untuk memberikan pelayanan berkualitas tinggi dalam suasana yang nyaman dan ramah.',
      rating: 0,
      address: 'Jl. Dahlia No. 10, Kota Harmoni, Provinsi Sentosa',
      phoneNumber: '+621234567890',
      serviceTypeId: 4,
      pivotImgId: 14,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Klinik Gigi Harmoni Senyum',
      description: 'Merupakan pusat kesehatan gigi yang terkemuka, menyediakan layanan perawatan gigi yang komprehensif dengan fokus pada kepuasan dan kesejahteraan pasien. Tim dokter gigi yang berpengalaman dan ramah siap memberikan perawatan terbaik untuk setiap pasien.',
      rating: 0,
      address: 'Jl. Mawar No. 12, Kota Bahagia, Provinsi Sentosa',
      phoneNumber: '+621234567891',
      serviceTypeId: 4,
      pivotImgId: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Klinik Gigi Ceria Jaya',
      description: 'Dikenal dengan pelayanan gigi yang profesional dan berkualitas tinggi, Klinik Gigi Ceria Jaya menyediakan perawatan gigi modern dengan pendekatan yang holistik. Dengan peralatan canggih dan lingkungan yang nyaman, klinik ini siap memberikan senyuman terbaik bagi setiap pasien.',
      rating: 0,
      address: 'Jl. Cendana No. 5, Kota Maju Jaya, Provinsi Sentosa',
      phoneNumber: '+621234567892',
      serviceTypeId: 4,
      pivotImgId: 16,
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
