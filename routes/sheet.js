const express = require("express");
const router = express.Router();

router.get("/new", (req, res, next) => {
  res.render("newsheet");
});

module.exports = router;
