"use strict";

var _require = require("mongoose"),
  mongoose = _require.mongoose;
var expenseSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: Number,
  category: String,
  description: String,
  date: {
    type: Date,
    "default": Date.now
  }
});
module.exports = mongoose.model('Expense', expenseSchema);