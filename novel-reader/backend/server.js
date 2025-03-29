const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const novelRoutes = require('./routes/novels');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/novel-reader', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Đã kết nối tới MongoDB'))
.catch(err => console.error(err));

// Routes
app.use('/api/novels', novelRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server đang chạy trên cổng ${PORT}`));