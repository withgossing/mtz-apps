const { AppDataSource } = require("../config/data-source");
const User = require("../entity/user.entity");
const Point = require("../entity/point.entity");

const userRepository = AppDataSource.getRepository(User);

module.exports = {
  findAll: async () => {
    return await userRepository.find();
  },

  findById: async (id) => {
    return await userRepository.findOneBy({ id });
  },

  createUser: async (userData) => {
    const user = userRepository.create(userData);
    return await userRepository.save(user);
  },

  updateUser: async (id, userData) => {
    await userRepository.update(id, userData);
    return await userRepository.findOneBy({ id });
  },

  softDeleteUser: async (id) => {
    await userRepository.softDelete({ id });
  },

  // userId 로 사용자 조회
  findByUserId: async (userId) => {
    return await userRepository.findOneBy({
      user_id: userId,
    });
  },

  // departmentCode로 사용자 건수 조회
  userCountBydepartmentCode: async (departmentCode) => {
    return await userRepository.count({
      where: { department_code: departmentCode },
    });
  },

  // point 가 높은 사용자 건수 조회 ( 동일 부서 기준 )
  higherScoreCountByScore: async (param) => {
    return await userRepository
      .createQueryBuilder("user")
      .innerJoin(Point, "point", "user.user_id = point.user_id")
      .where("user.department_code = :departmentCode", {
        departmentCode: param.departmentCode,
      })
      .andWhere("point.score_point > :userScore", {
        userScore: Number(param.scorePoint),
      })
      .getCount();
  },
};
