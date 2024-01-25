const Expense = require("../models/Expense");

exports.createExpense = async (req, res) => {
    try{
        const newExpense = new Expense(req.body);
        await newExpense.save();
        res.status(200).json({id:newExpense._id, message: 'Expense Created Successfully!!'});
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

exports.getExpensesById = async (req, res) => {
    try{
        const expenseId = req.params.id;
        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
          }
        res.status(200).json({ message:'Data Fetched Successfully!!', data: expense})
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

// Get all expenses for a specific user
exports.getExpenses = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
        const offset = (page - 1) * limit;
        let query = Expense.find({ userId: req.userId });
        const expenses = await query.skip(offset).limit(limit).exec();
        const totalExpenses = await Expense.countDocuments();
        const totalPages = Math.ceil(totalExpenses / limit);
        res.status(200).json({ message:'Data Fetched Successfully!!', currentPage: page,totalPages: totalPages, totalJobs: totalExpenses, data: expenses})
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

// Get expense for a specific ID
exports.getExpenseById = async (req, res) => {
    try{
        const expenseId = req.params.id;
        const expense = await Expense.findById(expenseId);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
          }
        res.status(200).json({ message:'Data Fetched Successfully!!', data: expense})
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}