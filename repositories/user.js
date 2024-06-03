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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
        { transaction },
      )
      await transaction.commit()
      return user;
    } catch (error) {
      await transaction.rollback()
      console.log(error)
    }
  },
  getUser: async (filterObj) => {
    try {      
      const user = await models.user.findOne({
        where: filterObj,
      });
      return user;
    } catch (error) {
      console.log(error)
      throw ERROR.INTERNAL_SERVER_ERROR;
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
      console.log(error)
      throw ERROR.INTERNAL_SERVER_ERROR;
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
            1 as join_key
          from users u
          where 
            u.id = :id
            and u."deletedAt" is null
        ), review_data as (
          select 
            r.*,
            json_build_object(
              s.id,
              s.name,
              s.rating,
              s.description
            ) services 
          from reviews r
          right join user_data ud on ud.id = r."userId" 
          join services s on s.id = r."serviceId" 
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
  // getReviewHistoryByUserId: async (id, limit = 10, offset = 0, sortBy = 'id', sortingMethod = 'asc', whereClauses = [{ deletedAt: null }]) => {
  //   try {
  //     const data = models.user.findOne({
  //       attributes: ['id', 'username', 'email'],
  //       where: {
  //         id,
  //         deletedAt: null,
  //       },
  //       include: [
  //         {
  //           model: models.review,
  //           where: { [models.Sequelize.Op.and]: whereClauses },
  //           limit,
  //           offset,
  //           order: [[sortBy, sortingMethod]],
  //           required: false,
  //           include: [
  //             {
  //               model: models.service,
  //               attributes: ['id', 'name', 'rating', 'description'],
  //               where: { deletedAt: null },
  //             }
  //           ]
  //         }          
  //       ],
  //     })
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //     throw ERROR.INTERNAL_SERVER_ERROR;
  //   }
  // }
}
