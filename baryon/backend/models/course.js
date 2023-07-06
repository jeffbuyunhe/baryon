const mongoose = require('mongoose')

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    data: [
        {
            type: String
        }
    ]
})

const groupChatSchema = new mongoose.Schema({
    title: {
        type: String
    }
})

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    instructors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    labels : [
        {
            type: String,
            default: []
        }
    ],
    groupChats: [
        {
            type: groupChatSchema,
            default: []
        }
    ],
})

courseSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Course', courseSchema)