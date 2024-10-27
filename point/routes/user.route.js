var express = require("express");
var router = express.Router();

const userService = require("../service/user.service");
const pointService = require("../service/point.service");

router.get("/", async (req, res, next) => {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await userService.softDeleteUser(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// userId 로 사용자 조회
router.get("/userid/:userId", async (req, res, next) => {
  try {
    const user = await userService.findByUserId(req.params.userId);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// departmentCode 로 사용자 수 조회
router.get("/departmentCount/:departmentCode", async (req, res, next) => {
  try {
    const userCount = await userService.userCountBydepartmentCode(
      req.params.departmentCode
    );
    res.json({ userCount: userCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/rank/:userId", async (req, res, next) => {
  try {
    const user = await userService.findByUserId(req.params.userId);
    const point = await pointService.findByUserId(req.params.userId);
    const userCount = await userService.userCountBydepartmentCode(
      req.params.departmentCode
    );
    const highterScoreCount = await userService.higherScoreCountByScore({
      departmentCode: user.department_code,
      scorePoint: point.score_point,
    });

    const userRank = highterScoreCount + 1;
    const percentile = Number((((userRank - 1) / userCount) * 100).toFixed(2));

    let userGrade = "X";

    if (percentile < 10) {
      userGrade = "S";
    } else if (percentile < 30) {
      userGrade = "A";
    } else if (percentile < 70) {
      userGrade = "B";
    } else if (percentile < 90) {
      userGrade = "C";
    } else {
      userGrade = "X";
    }

    res.json({
      userRank: userRank,
      userCount: userCount,
      userGrade: userGrade,
      userPercent: percentile,
      scorePoint: point.score_point,
      currentPoint: point.current_point,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
