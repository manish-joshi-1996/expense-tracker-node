"use strict";

var express = require('express');
var router = express.Router();
var expenseController = require('../expenseController');
var verifyToken = require('../../middleware/authMiddleware');
router.post('/expense', verifyToken, expenseController.createExpense);
router.get('/expense', verifyToken, expenseController.getExpenses);
router.get('/expense/:id', verifyToken, expenseController.getExpenseById);
module.exports = router;