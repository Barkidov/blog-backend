const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts'); // <--- Добавляем импорт маршрутов постов

const app = express();

// Подключение к базе данных
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // <--- Для обслуживания загруженных изображений

// Маршруты
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes); // <--- Подключаем маршруты постов

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
