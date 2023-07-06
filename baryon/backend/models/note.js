const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true,
        minlength: 1
    },
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Note', noteSchema)