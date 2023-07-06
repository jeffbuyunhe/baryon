const mongoose = require('mongoose')

const courseFileSchema = new mongoose.Schema({

    filename: String,
    size: Number,
    contentType:String,
    uploadDate:Date,
    uploaderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
    
})

courseFileSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('CourseFile', courseFileSchema)
