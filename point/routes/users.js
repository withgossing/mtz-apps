var express = require("express");
var router = express.Router();

const { AppDataSource } = require("../config/data-source");
const User = require("../entity/point_user");

/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
