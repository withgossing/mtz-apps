const { AppDataSource } = require("../config/data-source");
const Balances = require("../entity/point.entity");

const pointRepository = AppDataSource.getRepository(Balances);

module.exports = {
  findAll: async () => {
    return await pointRepository.find();
  },

  findById: async (id) => {
    return await pointRepository.findOneBy({ id });
  },

  createPoint: async (pointData) => {
    const point = pointRepository.create(pointData);
    return await pointRepository.save(point);
  },

  updatePoint: async (id, pointData) => {
    await pointRepository.update(id, pointData);
    return await pointRepository.findOneBy({ id });
  },

  softDeletePoint: async (id) => {
    await pointRepository.softDelete({ id });
  },

  findByUserId: async (userId) => {
    return await pointRepository.findOneBy({
      user_id: userId,
    });
  },
};
