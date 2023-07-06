const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
    announcement: {
        type: String,
        required: true
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    instructorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*60*24*7*24,
    }
})

announcementSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Announcement', announcementSchema)