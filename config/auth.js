module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please Login first");
    res.redirect("/user/login");
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "You Are Already Logged In");
    res.redirect("/user/dashboard");
  }
};
