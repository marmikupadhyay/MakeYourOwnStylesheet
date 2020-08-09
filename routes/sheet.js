const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Sheet = require("../models/Sheet");
const { response } = require("express");
const { saveAs } = require("file-saver");
const Blob = require("cross-blob");

router.get("/new", ensureAuthenticated, (req, res, next) => {
  var newSheet = new Sheet({
    author: req.user._id,
    filename: "untitled",
    content: {}
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
      res.render("newsheet", { id: req.params.id, title: sheet.filename });
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

module.exports = router;
