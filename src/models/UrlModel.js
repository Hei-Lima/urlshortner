const mongoose = require('mongoose');
const { Schema } = mongoose;

const urlSchema = new Schema({
    sourceUrl: String,
    shortUrl: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expirationDate: {
        type: Date,
        default: () => Date.now() + 15 * 60 * 1000,
    }
});

module.exports = mongoose.model('Url', urlSchema);