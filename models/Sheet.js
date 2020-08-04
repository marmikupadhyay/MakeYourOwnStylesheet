const mongoose = require("mongoose");

const SheetSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
});

const Sheet = mongoose.model("Sheet", SheetSchema);
module.exports = Sheet;
