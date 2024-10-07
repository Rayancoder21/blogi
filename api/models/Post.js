const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const PostSchema = new mongoose.Schema({
    title: String,
    summary: String,
    cover: String,
    content: String,
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;