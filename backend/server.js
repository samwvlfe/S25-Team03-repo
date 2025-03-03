const express = require('express');
const cors = require('cors');
const aboutRoutes = require('./routes/aboutRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const port = process.env.PORT || 2999;

app.use(express.json());
app.use(cors());

// API Routes
app.use('/api', aboutRoutes);
app.use('/api', authRoutes);
app.use('/api', adminRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
