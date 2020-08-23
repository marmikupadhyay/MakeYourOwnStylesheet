const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Sheet = require("../models/Sheet");
const { response } = require("express");
const { saveAs } = require("file-saver");
const Blob = require("cross-blob");
const User = require("../models/User");
const e = require("express");

router.get("/new", ensureAuthenticated, (req, res, next) => {
  var newSheet = new Sheet({
    author: req.user._id,
    filename: "untitled",
    content: {},
    colabs: []
  });
  newSheet
    .save()
    .then(sheet => {
      req.flash("success_msg", "Sheet Created");
      res.redirect(`/sheet/edit/${sheet._id}`);
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/edit/:id", ensureAuthenticated, (req, res, next) => {
  Sheet.findOne({ _id: req.params.id })
    .then(sheet => {
      var access = true;
      if (
        req.user._id.equals(sheet.author) ||
        sheet.colabs.includes(req.user._id)
      ) {
        res.render("newsheet", {
          id: req.params.id,
          title: sheet.filename,
          author: sheet.author,
          userId: req.user._id
        });
      } else {
        req.flash("error_msg", "Not Authorized");
        res.redirect("/user/dashboard");
      }
    })
    .catch(err => {
      console.log(err);
    });
});

router.post("/save/:id", (req, res, next) => {
  const { sheetTitle, content } = req.body;
  var updatedSheet = { $set: { filename: sheetTitle, content } };
  Sheet.findOneAndUpdate({ _id: req.params.id }, updatedSheet)
    .then(sheet => {
      req.flash("success_msg", "Sheet Saved");
      res.redirect(`/sheet/edit/${req.params.id}`);
    })
    .catch(err => {
      console.log(err);
    });
});

//Request for getting cmpnames
router.get("/cmpnames/:id", (req, res, next) => {
  Sheet.findOne({ _id: req.params.id })
    .then(sheet => {
      if (!sheet) {
        res.status(404);
        res.json({ error: "Sheet does not exist" });
      } else {
        var cmpNames = [];
        for (property in sheet.content) {
          var temp;
          if (sheet.content[property][0] == ".") {
            temp = "class";
          }
          if (sheet.content[property][0] == "#") {
            temp = "id";
          }
          cmpNames.push(property + `: ${temp}`);
        }
        res.status(200);
        res.json({ cmpNames });
      }
    })
    .catch(err => {
      res.status(500);
      res.json({ error: "Internal Server Error" });
      console.log(err);
    });
});

//Req for getting sheet code
router.get("/code/:id", (req, res, next) => {
  Sheet.findOne({ _id: req.params.id })
    .then(sheet => {
      if (!sheet) {
        res.status(404);
        res.json({ error: "Sheet does not exist" });
      } else {
        res.status(200);
        if (sheet.content == null) {
          res.json({ code: {} });
        } else {
          res.json({ code: sheet.content });
        }
      }
    })
    .catch(err => {
      res.status(500);
      res.json({ error: "Internal Server Error" });
      console.log(err);
    });
});

//Handling Sheet Deletion
router.get("/delete/:id", ensureAuthenticated, (req, res) => {
  Sheet.findOneAndDelete({ _id: req.params.id })
    .then(sheet => {
      req.flash("success_msg", "Sheet Deleted");
      res.redirect("/user/dashboard");
    })
    .catch(err => {
      consolelog(err);
    });
});

// Download Sheet Route

router.get("/download/:id", ensureAuthenticated, (req, res, next) => {
  var finalCss = "";

  Sheet.findOne({ _id: req.params.id })
    .then(sheet => {
      var cssString = sheet.content;
      for (property in cssString) {
        finalCss += `${cssString[property]}`;
      }
      var blob = new Blob([`${finalCss}`], {
        type: "text/plain;charset=utf-8"
      });
      saveAs(blob, `${sheet.filename}.css`);
      res.redirect("/user/dashboard");
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/preview/:id", ensureAuthenticated, (req, res) => {
  res.render("previewPage");
});

//Adding collabrators to sheets
router.post("/adduser/:id", ensureAuthenticated, (req, res) => {
  const userToFind = req.body;
  Sheet.findOne({ _id: req.params.id }, (err, sheet) => {
    if (!sheet.author.equals(req.user._id)) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/user/dashboard");
    }
  });
  User.findOne({ username: userToFind.name })
    .then(user => {
      if (!user) {
        res.status(404);
        res.json({ error: "User Not Found" });
      } else {
        Sheet.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { colabs: user._id } }
        )
          .then(sheet => {
            res.status(200);
            res.json({ name: user.username });
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// Removing Collabarators
router.post("/removeuser/:id", ensureAuthenticated, (req, res) => {
  const userToFind = req.body;
  Sheet.findOne({ _id: req.params.id }, (err, sheet) => {
    if (!sheet.author.equals(req.user._id)) {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/user/dashboard");
    }
  });
  User.findOne({ username: userToFind.name })
    .then(user => {
      if (!user) {
        res.status(404);
        res.json({ error: "User Not Found" });
      } else {
        Sheet.findOneAndUpdate(
          { _id: req.params.id },
          { $pull: { colabs: user._id } }
        )
          .then(sheet => {
            res.status(200);
            res.json({ name: user.username });
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/collablist/:id", (req, res) => {
  Sheet.findOne({ _id: req.params.id })
    .then(sheet => {
      if (!sheet) {
        res.status(404);
        res.json({ error: "Sheet Not Found" });
      } else {
        User.find({})
          .then(users => {
            users = users.filter(user => {
              return sheet.colabs.includes(user._id);
            });
            const collabarators = users.map(user => {
              return user.username;
            });
            res.status(200);
            res.json({ users: collabarators });
          })
          .catch(err => {
            console.log(err);
            res.status(500);
            res.json({ error: "Internal Server Error" });
          });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500);
      res.json({ error: "Internal Server Error" });
    });
});

module.exports = router;
