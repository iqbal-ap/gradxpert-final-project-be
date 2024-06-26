const models = require('../models/index');
const ERROR = require('../helper/error');
const { STATUS_CODES } = require('../helper/httpStatusCodes');

module.exports = {
  getListServicesWithCount: async (limit = 10, offset = 0, sorting = "s.\"id\" asc", whereClauses = 's.\"deletedAt\" is null') => {
    try {
      const servicesWithPagination = await models.DbConnection.query(`
      with service_list as (
        select 
          s.*,
          jsonb_build_object(
            'id', st.id,
            'name', st.name
          ) "serviceType",
          i.url "imageUrl",
          1 as join_key
        from services s
        join "serviceTypes" st ON st.id = s."serviceTypeId" 
        left join "pivotImages" pi2 on s."pivotImgId" = pi2."pivotImgId" 
        join images i 
          on i.id = pi2."imageId"
          and i."isMainImg" = true 
        where 
          ${whereClauses}
          and st."deletedAt" is null
        group by 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
        order by ${sorting}
        limit :limit
        offset :offset
      ), total as (
        select 
          coalesce(count(1), 0)::integer total,
          1 as join_key
        from services s
        where ${whereClauses}
      )
      select 
        t.total,
        coalesce(
          jsonb_agg(to_jsonb(sl.*) - 'join_key')
          filter (where sl.id is not null)
        , '[]') as data
      from total t
      left join service_list sl on t.join_key = sl.join_key
      group by 1
      `, {
        replacements: {
          limit,
          offset,
        },
        type: models.Sequelize.QueryTypes.SELECT,
        raw: true,
      })
      return servicesWithPagination
    } catch (error) {
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  getServiceByIdWithCount: async (id, limit = 10, offset = 0, sorting = 'r.id asc', whereClauses = '') => {
    try {
      const service = await models.DbConnection.query(`
        with service_data as (
          select 
            s.*,
            jsonb_build_object(
              'id', st.id,
              'name', st.name
            ) "serviceType",
            jsonb_agg(
            	jsonb_build_object(
	              'id', i.id,
	              'imageUrl', i.url,
	              'isMainImg', i."isMainImg"
	            )
            ) images,
            1 as join_key
          from services s 
          join "serviceTypes" st 
            on st.id = s."serviceTypeId"
          left join "pivotImages" pi2 on s."pivotImgId" = pi2."pivotImgId" 
          join images i on i.id = pi2."imageId" 
          where
            s.id = :id
            and s."deletedAt" is null
            and st."deletedAt" is null
          group by 
          	s.id,
          	st.id
        ), review_data as (
          select 
            r.*,
            jsonb_build_object(
              'id', u.id,
              'username', u.username,
              'email', u.email,
              'imageUrl', i.url
            ) as user
          from reviews r
          join service_data sd on sd.id = r."serviceId"
          join users u on r."userId" = u.id 
          left join "pivotImages" pi2 on u."pivotImgId" = pi2."pivotImgId" 
          join images i on i.id = pi2."imageId" 
          where
            ${whereClauses}
            and u."deletedAt" is null
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
              from review_data
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
            'id', sd.id,
            'name', sd.name,
            'description', sd.description,
            'rating', sd.rating,
            'address', sd.address,
            'phoneNumber', sd."phoneNumber",
            'images', sd."images",
            'serviceTypeId', sd."serviceTypeId",
            'serviceType', sd."serviceType",
            'createdAt', sd."createdAt",
            'updatedAt', sd."updatedAt",
            'deletedAt', sd."deletedAt",
            'reviews', prd.reviews
          ) as data
        from service_data sd
        join count_review_data crd on crd.join_key = sd.join_key
        left join paginated_review_data prd on sd.join_key = prd.join_key;
      `, {
        replacements: {
          id,
          limit,
          offset,
        },
        raw: true,
        type: models.Sequelize.QueryTypes.SELECT,
      });
      return service;
    } catch (error) {
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  getServiceById: async (id) => {
    try {
      const service = await models.service.findOne({
        where: {
          id,
          deletedAt: null,
        },
      });
      return service;
    } catch (error) {
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
  updateServiceById: async (id, name, description, rating, address, phoneNumber, serviceTypeId, trx) => {
    const transaction = trx ? trx : await models.DbConnection.transaction({});
    try {
      const service = await models.service.update(
        {
          name, 
          description,
          rating,
          address,
          phoneNumber,
          serviceTypeId,
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
      ).then((res) => res[1][0]);
      if (trx) return service;
      await transaction.commit();
      return service;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;     
    }
  },
  deleteServiceById: async (id) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      const service = await models.service.update(
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
      ).then((res) => res[1][0]);
      await transaction.commit();
      return service;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;     
    }
  },
  createService: async (name, description, rating, address, phoneNumber, serviceTypeId) => {
    const transaction = await models.DbConnection.transaction({});
    try {
      const service = await models.service.create(
        {
          name, 
          description,
          rating,
          address,
          phoneNumber,
          serviceTypeId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          transaction,
        },
      )
      await transaction.commit();
      return service;
    } catch (error) {
      await transaction.rollback();
      error.code = STATUS_CODES.InternalServerError;
      throw error;     
    }
  },
  getRelatedService: async (id, serviceTypeId, limit = 5) => {
    try {
      const service = await models.DbConnection.query(`
        select 
          s.*,
          i.url "imageUrl"
        from services s 
        left join "pivotImages" pi2
          on pi2."pivotImgId" = s."pivotImgId"
        join images i 
          on i.id = pi2."imageId"
          and i."isMainImg" = true
        where 
          s.id != :id
          and s."serviceTypeId" = :serviceTypeId
          and s."deletedAt" is null
        limit :limit
      `, {
        replacements: {
          id,
          serviceTypeId,
          limit,
        },
        raw: true,
        type: models.Sequelize.QueryTypes.SELECT,
      })
      return service;
    } catch (error) {
      error.code = STATUS_CODES.InternalServerError;
      throw error;
    }
  },
}
