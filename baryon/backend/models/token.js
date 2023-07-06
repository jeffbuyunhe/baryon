const mongoose = require('mongoose')
const TokenTypes = require('../utils/tokenTypes')

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60*24*3,
    },
    tokenType: {
        type: Number,
        enum: Object.values(TokenTypes),
        required: true
    }
})

module.exports = mongoose.model('Token', tokenSchema)