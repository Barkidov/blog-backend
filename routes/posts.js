// routes/posts.js
const express = require('express');
const multer = require('multer');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// Настройка хранения изображений
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Эндпоинт для создания поста
router.post('/create', authMiddleware, upload.single('image'), async (req, res) => {
    const { content } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        const post = new Post({
            userId: req.user.id,
            content,
            imageUrl
        });

        await post.save();
        res.status(201).json(post);
    } catch (err) {
        console.error('Error creating post:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Эндпоинт для получения всех постов пользователя
router.get('/', authMiddleware, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error('Error fetching posts:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Проверка, что пользователь имеет право удалить пост
        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        // Удаление поста
        await Post.deleteOne({ _id: req.params.id });

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
