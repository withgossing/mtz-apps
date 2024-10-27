var express = require("express");
var router = express.Router();

const title = "Point Dashboard";

router.get("/", function (req, res, next) {
  res.render("index", { title: title, layout: "layouts/main.layout.ejs" });
});

router.get("/test/:userId", async (req, res, next) => {
  try {
    res.render("login", {
      userId: req.params.userId,
      layout: "layouts/login.layout.ejs",
      redirectUrl: "/",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
