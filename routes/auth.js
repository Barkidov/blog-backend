const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
    const { login, password } = req.body;

    try {
        // Проверка, существует ли пользователь
        const existingUser = await User.findOne({ login });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const newUser = new User({ login, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during user registration:', err); // Логирование ошибок
        res.status(500).json({ message: 'Server error' });
    }
});

// Логин пользователя
router.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        // Проверка, существует ли пользователь
        const user = await User.findOne({ login });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Генерация JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error('Error during user login:', err); // Логирование ошибок
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
