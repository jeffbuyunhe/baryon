const mongoose = require('mongoose')

const courseMaterialSchema = new mongoose.Schema({

    label: {
        type:String,
        required: true
    },
    title: {
        type:String,
        required:true
    },
    courseFileId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourseFile'
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
    
})

courseMaterialSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('CourseMaterial', courseMaterialSchema)