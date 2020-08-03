const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

router.get("/new", ensureAuthenticated, (req, res, next) => {
  res.render("newsheet");
});

module.exports = router;
