const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
    title:
    {
        type: String,
        required: true
    },
    dueDate: 
    {
        type: Date,
        required:true
    },
    weight: 
    {
        type: Number,
        required:true
    },
    totalMark:
    {
        type: Number,
        required:true
    },
    courseId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required:true
    },
    courseFileId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:'CourseFile'
    }

})

assignmentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Assignment', assignmentSchema)