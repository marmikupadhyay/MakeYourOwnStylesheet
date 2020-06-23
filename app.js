const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");

//INITALIZE APP
const app = express();

//Setting PUBLIC static folder
app.use("/", express.static(path.join(__dirname, "public")));

// Setting Up View Engine
app.use(expressLayouts);
app.set("view engine", "ejs");

//BODY PARSER
app.use(express.urlencoded({ extended: false }));

//Session MiddleWare
app.use(
  session({
    secret: "kyun batau",
    resave: true,
    saveUninitialized: true
  })
);

//Connect Flash
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res, next) => {
  res.redirect("/user");
});

app.use("/user", require("./routes/default"));

//Listening TO PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Listening on PORT ${PORT}`));
