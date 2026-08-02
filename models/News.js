// ==========================================
// NEWSNOVA24 - NEWS MODEL
// ==========================================

const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    author: {
        type: String,
        required: true,
        trim: true
    },

    image: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    content: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

const News = mongoose.model("News", newsSchema);

module.exports = News;