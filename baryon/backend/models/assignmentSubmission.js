const mongoose = require('mongoose')

const assignmentSubmissionSchema = new mongoose.Schema({

    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Assignment',
        required: true,
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    submissionDate: {
        type: Date,
    },
    encodedFile: 
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'CourseFile'
    },
    markObtained: 
    {
        type: Number,
    },
    feedback: 
    {
        type: String,
    }
    
})

assignmentSubmissionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('AssignmentSubmission', assignmentSubmissionSchema)