const models = require('../models/index');
const ERROR = require('../helper/error');
const { STATUS_CODES } = require('../helper/httpStatusCodes');

module.exports = {
  createUser: async (username, email, password, phoneNumber, role) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      const user = await models.user.create({
        username,
        password,
        email,
        phoneNumber,
        role: role,
        pivotImgId: 1, // * Currently, only passing default value 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
        { transaction },
      )
      await transaction.commit()
      return user;
    } catch (error) {
      await transaction.rollback()
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  updateUserById: async (id, username, email, phoneNumber) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      const user = await models.user.scope('nonAuth').update(
        {
          username,
          email,
          phoneNumber,
          updatedAt: new Date(),
        },
        {
          where: {
            id,
            deletedAt: null,
          },
          transaction,
          returning: true,
        },
      )
        .then((res) => {
          const response = res[1][0].dataValues;
          const { password, ...otherData } = response;
          return otherData;
        })
      await transaction.commit()
      return user;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  deleteUserById: async (id) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      const user = await models.user.scope('nonAuth').update(
        {
          deletedAt: new Date(),
        },
        {
          where: {
            id,
            deletedAt: null,
          },
          transaction,
          returning: true,
        },
      )
        .then((res) => {
          const response = res[1][0].dataValues;
          const { password, ...otherData } = response;
          return otherData;
        })
      await transaction.commit()
      return user;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  getUser: async (whereClauses, replacementsObj, password = '') => {
    try {      
      const user = await models.DbConnection.query(`
        select 
          u.id,
          u.username, ${password}
          u.email,
          u."phoneNumber",
          u."role",
          u."pivotImgId",
          i.url "imageUrl",
          u."createdAt",
          u."updatedAt",
          u."deletedAt"
        from users u 
        left join "pivotImages" pi2 on u."pivotImgId" = pi2."pivotImgId" 
        left join images i on i.id = pi2."imageId" 
        where 
          ${whereClauses};
      `, {
        replacements: replacementsObj,
        type: models.Sequelize.QueryTypes.SELECT,
        raw: true,
      }).then(res => res[0])
      return user;
    } catch (error) {
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  getListUser: async (username, email, limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc') => {
    try {
      const users = await models.user.findAll({
        where: {
          [models.Sequelize.Op.and] : [
            { deletedAt: null },
            {
              [models.Sequelize.Op.or]: [
                { username },
                { email },
              ]
            }
          ],
        },
        limit,
        offset,
        order: [[sortBy, sortingMethod]],
      })
      return users;
    } catch (error) {
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  getReviewHistoryByUserIdWithCount: async (id, limit = 1, offset = 0, sorting = 'r.id asc', whereClauses = '') => {
    try {
      const history = await models.DbConnection.query(`
        with user_data as (
          select 
            u.id,
            u.username,
            u.email,
            i.url "imageUrl",
            1 as join_key
          from users u
          left join "pivotImages" pi2 on u."pivotImgId" = pi2."pivotImgId" 
          join images i 
            on i.id = pi2."imageId"
            and i."isMainImg" = true
          where 
            u.id = :id
            and u."deletedAt" is null
        ), review_data as (
          select 
            r.*,
            json_build_object(
              'id', s.id,
              'name', s.name,
              'rating', s.rating,
              'description', s.description,
              'imageUrl', i.url
            ) services 
          from reviews r
          right join user_data ud on ud.id = r."userId" 
          join services s on s.id = r."serviceId" 
          left join "pivotImages" pi2 on s."pivotImgId" = pi2."pivotImgId" 
          join images i 
            on i.id = pi2."imageId"
            and i."isMainImg" = true
          where ${whereClauses}
          order by ${sorting}
        ), paginated_review_data as (
          select
            coalesce(
              jsonb_agg(rd.*)
              filter (where rd.id is not null),
            '[]') reviews,
            1 as join_key
          from (
          	select * 
          	from review_data rd          	
          	limit :limit
          	offset :offset
          ) rd
        ), count_review_data as (
          select
            coalesce(count(rd.*), 0)::integer total,
            1 as join_key
          from review_data rd
        )
        select
          crd.total,
          jsonb_build_object (
            'id', ud.id,
            'username', ud.username,
            'email', ud.email,
            'imageUrl', ud."imageUrl",
            'reviews', prd.reviews
          ) as data
        from user_data ud
        join count_review_data crd on crd.join_key = ud.join_key
        left join paginated_review_data prd on ud.join_key = prd.join_key;
      `, {
        replacements: {
          id,
          limit,
          offset,
        },
        type: models.Sequelize.QueryTypes.SELECT,
        raw: true,
      });
      return history[0];
    } catch (error) {
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
}
