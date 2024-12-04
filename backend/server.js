const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
var cors = require('cors');


dotenv.config();

const app = express();

// Connect to database
connectDB();

app.use(cors());

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
