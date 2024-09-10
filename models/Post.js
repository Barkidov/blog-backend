const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    imageUrl: { type: String }, // Поле для ссылки на изображение
    createdAt: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
