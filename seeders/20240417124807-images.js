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
        url: 'https://static.vecteezy.com/system/resources/previews/005/129/844/non_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Rumah Sakit Sentosa
      {
        description: 'Rumah Sakit Sentosa main image',
        url: 'https://asset.kompas.com/crops/mOKFrYHlSTM6SEt4aD9PIXZnJE0=/0x5:593x400/750x500/data/photo/2020/03/16/5e6ee88f78835.jpg',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Rumah Sakit Sentosa submain image 1',
        url: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?cs=srgb&dl=pexels-pixabay-236380.jpg&fm=jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Rumah Sakit Sentosa submain image 2',
        url: 'https://th-thumbnailer.cdn-si-edu.com/F6MN7vfNd8zeHpNYi58PzoC_OAo=/1000x750/filters:no_upscale()/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/b4/c6/b4c65fd0-01ba-4262-9b3d-f16b53bca617/istock-172463472.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Rumah Sakit Sentosa submain image 3',
        url: 'https://www.hopkinsmedicine.org/-/media/patient-care/images/patient-rooms-1.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Rumah Sakit Bintang Sejahtera
      {
        description: 'Rumah Sakit Bintang Sejahtera main image',
        url: 'https://www.kavacare.id/assets/uploads/2023/01/Narayana-Health-Hospital-Rekomendasi-Rumah-Sakit-India-Kavacare.jpg?resolution=732,2.625',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Rumah Sakit Bintang Sejahtera submain image 1',
        url: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?cs=srgb&dl=pexels-pixabay-236380.jpg&fm=jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Rumah Sakit Bintang Sejahtera submain image 2',
        url: 'https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg?cs=srgb&dl=pexels-pixabay-236380.jpg&fm=jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Rumah Sakit Bintang Sejahtera submain image 3',
        url: 'https://www.hopkinsmedicine.org/-/media/patient-care/images/patient-rooms-1.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Rumah Sakit Cemerlang Abadi
      {
        description: 'Rumah Sakit Cemerlang Abadi main image',
        url: 'https://www.kavacare.id/assets/uploads/2022/10/Island-Hospital-Penang-1-1.jpg?resolution=732,2.625',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Rumah Sakit Cemerlang Abadi submain image 1',
        url: 'https://www.hfmmagazine.com/ext/resources/images/2017/HFM-magazine/May/0517_design_UofC-Health-Patient-Rm-HB4-1050.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Rumah Sakit Cemerlang Abadi submain image 2',
        url: 'https://defineaesthetic.sg/wp-content/uploads/2019/12/186508349_109974154606580_3205024053314137653_n-e1623847943938-1024x832.jpeg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Rumah Sakit Cemerlang Abadi submain image 3',
        url: 'https://gleneagles.hk/images/02-Clinic-B_resize.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Apotik Sehat Sentosa
      {
        description: 'Apotik Sehat Sentosa main image',
        url: 'https://images.ctfassets.net/szez98lehkfm/2Pd3I8yVJ41bggza0Ck9Lq/368cf0a0e1d05e893b079678e7155166/MyIC_Inline_20428',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Apotik Sehat Sentosa submain image 1',
        url: 'https://t3.ftcdn.net/jpg/00/85/88/50/360_F_85885048_xRtm59cuj5kVKdoxenrBhJVX35JsClH0.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Apotik Sehat Sentosa submain image 2',
        url: 'https://5.imimg.com/data5/SELLER/Default/2023/5/305432046/JC/TV/TJ/20545053/apollo-expert-interior.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Apotik Sehat Sentosa submain image 3',
        url: 'https://media.istockphoto.com/id/1135284188/photo/if-you-need-its-here.jpg?s=612x612&w=0&k=20&c=2yfZHUqTEGW4-5r4Sc4pzWKx0DtubpdbTkX3h_w1AJg=',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Apotik Harmoni Sejahtera
      {
        description: 'Apotik Harmoni Sejahtera main image',
        url: 'https://qph.cf2.quoracdn.net/main-qimg-1db9e91e179f21f1fe14fb3106fb4f39-lq',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Apotik Harmoni Sejahtera submain image 1',
        url: 'https://media.istockphoto.com/id/1135284188/photo/if-you-need-its-here.jpg?s=612x612&w=0&k=20&c=2yfZHUqTEGW4-5r4Sc4pzWKx0DtubpdbTkX3h_w1AJg=',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Apotik Harmoni Sejahtera submain image 2',
        url: 'https://t4.ftcdn.net/jpg/00/89/89/91/360_F_89899105_UN5Bv2hYUx0TFzBdwpi8K1rkPzl3dYLx.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Apotik Harmoni Sejahtera submain image 3',
        url: 'https://5.imimg.com/data5/SELLER/Default/2023/5/305432046/JC/TV/TJ/20545053/apollo-expert-interior.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Apotik Maju Jaya Farma
      {
        description: 'Apotik Maju Jaya Farma main image',
        url: 'https://imengine.public.prod.inl.infomaker.io/?uuid=0be11571-4bf3-5f98-b575-64e1c1467bf4&function=cropresize&type=preview&source=false&q=75&crop_w=0.99999&crop_h=0.99999&width=2361&height=1606&x=1&y=1',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Apotik Maju Jaya Farma submain image 1',
        url: 'https://knowleswellness.com/wp-content/uploads/2023/03/What-Does-Local-Pharmacy-Mean.webp',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Apotik Maju Jaya Farma submain image 2',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8-e_Cp738FrhO6kbi23OuZ5fD9o7FmHR0oA&s',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Apotik Maju Jaya Farma submain image 3',
        url: 'https://makmursejati.co.id/wp-content/uploads/2021/06/27788_30-3-2021_23-25-59.jpeg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Laboratorium Sehat Sentosa
      {
        description: 'Laboratorium Sehat Sentosa main image',
        url: 'https://www.enr.com/ext/resources/2022/07/13/GenBldg_1_UCDH-California-Tower_ENRready.jpg?1657742986',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Laboratorium Sehat Sentosa submain image 1',
        url: 'https://www.biofarma.co.id/media/image/originals/post/2020/11/25/clinical-lab-img-box.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Laboratorium Sehat Sentosa submain image 2',
        url: 'https://www.rspkt.com/sites/rspkt.com/files/field/image/lab%20yuni_0.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Laboratorium Sehat Sentosa submain image 3',
        url: 'https://surabaya.go.id/uploads/pictures/2023/9/78992/original_IMG_6696.jpg?1695777836',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Laboratorium Harmoni Sejahtera
      {
        description: 'Laboratorium Harmoni Sejahtera main image',
        url: 'https://d2cbg94ubxgsnp.cloudfront.net/Pictures/1024x536/8/5/5/84855_feature-building_la-trobe_630.jpg',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Laboratorium Harmoni Sejahtera submain image 1',
        url: 'https://www.bu.edu/ctl/files/2022/10/shutterstock_1922200196-533x300.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Laboratorium Harmoni Sejahtera submain image 2',
        url: 'https://blog.quartzy.com/hubfs/Imported%20sitepage%20images/17349023_m.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Laboratorium Harmoni Sejahtera submain image 3',
        url: 'https://www.thestatesman.com/wp-content/uploads/2017/08/1494587303-lab517getty.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Laboratorium Maju Jaya Medika
      {
        description: 'Laboratorium Maju Jaya Medika main image',
        url: 'https://www.sf.edu/wp-content/uploads/2023/10/030620_Campus_Achatz_34-scaled.jpg',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Laboratorium Maju Jaya Medika submain image 1',
        url: 'https://www.shutterstock.com/image-photo/young-scientists-conducting-research-investigations-600nw-2149947783.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Laboratorium Maju Jaya Medika submain image 2',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYBcZMpbJvIeLvnzVUGPInC2bm6xJHQPQwvw&s',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Laboratorium Maju Jaya Medika submain image 3',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQK0v8xAnr31qn3MFcP7i7R6_y7Z33K7Qsv3w&s',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Klinik Sehat Sentosa
      {
        description: 'Klinik Sehat Sentosa main image',
        url: 'https://res.cloudinary.com/dk0z4ums3/image/upload/w_360,h_240,c_fill,f_auto/v1607913819/hospital_image/40d3f0199505_Klinik%20Amelia%20Medika%20-%20tampak%20depan.jpeg.jpg',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Sehat Sentosa submain image 1',
        url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Sehat Sentosa submain image 2',
        url: 'https://medcor.com/wp-content/uploads/2022/09/OccupationalHealthClinic-700x465-1.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Sehat Sentosa submain image 3',
        url: 'https://editorial.femaledaily.com/wp-content/uploads/2023/07/IMG_20230707_160256-800x600.jpeg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Klinik Harmoni Sejahtera
      {
        description: 'Klinik Harmoni Sejahtera main image',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-cHEo2oWHspckSaBkLW9RDbtHUl6MBKmdrg&s',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Harmoni Sejahtera submain image 1',
        url: 'https://img2.beritasatu.com/cache/investor/480x310-3/2023/05/1684979213-1600x1200.webp',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Harmoni Sejahtera submain image 2',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5cTQDoH6LlL_ujgVFXKKKO2bbaTo9KNmXCA&s',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Harmoni Sejahtera submain image 3',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwIoBpWR3K57mAR4ipqh1VAV40q8H0XMneow&s',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Klinik Maju Jaya Medika
      {
        description: 'Klinik Maju Jaya Medika main image',
        url: 'https://indomedika.co.id/public/web/assets/img/service/clinic/a%20(3).webp',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Maju Jaya Medika submain image 1',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGoAng6ub8NnvHxzwfFhkGwY8knATBG-36Cg&s',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Maju Jaya Medika submain image 2',
        url: 'https://defineaesthetic.sg/wp-content/uploads/2019/12/186508349_109974154606580_3205024053314137653_n-e1623847943938-1024x832.jpeg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Maju Jaya Medika submain image 3',
        url: 'https://gleneagles.hk/images/02-Clinic-B_resize.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Klinik Gigi Sehat Utama
      {
        description: 'Klinik Gigi Sehat Utama main image',
        url: 'https://elitefitout.com.au/wp-content/uploads/2021/05/White_sands_dental_6-3-1-1024x683.jpg',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Gigi Sehat Utama submain image 1',
        url: 'https://stateofreform.com/wp-content/uploads/2017/09/Kaiser-Target-clinic.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Gigi Sehat Utama submain image 2',
        url: 'https://img.antaranews.com/cache/730x487/2023/12/06/Foto-3.jpg',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Gigi Sehat Utama submain image 3',
        url: 'https://images.squarespace-cdn.com/content/v1/58ee8599e4fcb5019408db8a/1492887717687-KLWSEQ7CZMBWCRV09NQ2/Photo+Mar+30%2C+9+56+33+AM.jpg?format=1500w',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Klinik Gigi Harmoni Senyum
      {
        description: 'Klinik Gigi Sehat Utama main image',
        url: 'https://www.its.ac.id/tkimia/wp-content/uploads/sites/23/2022/02/GIO_2426-1024x678.jpg',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Gigi Sehat Utama submain image 1',
        url: 'https://img.bookimed.com/clinic_webp/62f4dc9163e4b_b.webp',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Gigi Sehat Utama submain image 2',
        url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2xpbmljfGVufDB8fDB8fHww',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Gigi Sehat Utama submain image 3',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV_a6lLlEqIP3Vhb7-5z3rXRhprgLiwb_L6Q&s',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // * Klinik Gigi Ceria Jaya
      {
        description: 'Klinik Gigi Ceria Jaya main image',
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdnmLrSr86asD8E_JIdxhCp7pWJNFmfTKaLmyLxjwUh8_6_vsHvlKjneybuWtPMCzsNXg&usqp=CAU',
        isMainImg: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Gigi Ceria Jaya submain image 1',
        url: 'https://www.dcms.uscg.mil/Portals/10/DOL/BaseNCR/img/clinicPhoto.png',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Gigi Ceria Jaya submain image 2',
        url: 'https://www.internationalsos.co.id/-/media/indonesia-website/images/sos-medika/sos-medika-cipete_reception.jpg?h=400&la=en&w=600&hash=9CAA8191209DEECE859E866D38138936E3897C58',
        isMainImg: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        description: 'Klinik Gigi Ceria Jaya submain image 3',
        url: 'https://intermedika.co.id/wp-content/uploads/2022/09/WhatsApp-Image-2022-09-20-at-15.28.56-1.jpeg',
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
