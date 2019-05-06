const mongoose = require('mongoose');

const VideosSchema = mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    video: String,
    views: Number,
    postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
}, {
    timestamps: true
});

module.exports = mongoose.model('Videos', VideosSchema);