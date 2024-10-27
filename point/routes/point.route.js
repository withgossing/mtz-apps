var express = require("express");
var router = express.Router();

const pointRepository = require("../service/point.service");

router.get("/", async (req, res, next) => {
  try {
    const pointList = await pointRepository.findAll();
    res.json(pointList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const point = await pointRepository.findById(req.params.id);
    if (point) {
      res.json(point);
    } else {
      res.status(404).json({ message: "Point not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const newPoint = await pointRepository.createPoint(req.body);
    res.status(201).json(newPoint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const updatedPoint = await pointRepository.updatePoint(
      req.params.id,
      req.body
    );
    if (updatedPoint) {
      res.json(updatedPoint);
    } else {
      res.status(404).json({ message: "Point not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await pointRepository.softDeletePoint(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/userid/:userId", async (req, res, next) => {
  try {
    const point = await pointRepository.findByUserId(req.params.userId);
    res.json(point);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
