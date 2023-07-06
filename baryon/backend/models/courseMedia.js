const mongoose = require('mongoose')

const courseMediaSchema = new mongoose.Schema({

    label: {
        type:String,
        required: true
    },
    url: {
        type:String,
        required:true
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }
    
})

courseMediaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('CourseMedia', courseMediaSchema)