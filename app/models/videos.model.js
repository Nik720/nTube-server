const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

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

// Save slugs to 'myslug' field.
VideosSchema.plugin(URLSlugs('title', {field: 'slug'}));

module.exports = mongoose.model('Videos', VideosSchema);