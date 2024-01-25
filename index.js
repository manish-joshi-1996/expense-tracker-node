const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 3000;
const app = express();
const cors = require('cors');
const path = require('path');
const authRoutes = require('./src/controllers/functions/authRoutes');
const expenseRoutes = require('./src/controllers/functions/expenseRoute');

app.use(cors());
//MongoDB Connection
mongoose.connect('mongodb://localhost:27017/expense_tracker', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.json());
app.use('/', authRoutes);
app.use('/api', expenseRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})