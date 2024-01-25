const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/expense', verifyToken, expenseController.createExpense);
router.get('/expense', verifyToken, expenseController.getExpenses);
router.get('/expense/:id', verifyToken, expenseController.getExpenseById);

module.exports = router;
