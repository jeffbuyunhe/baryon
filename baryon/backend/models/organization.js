const mongoose = require('mongoose')

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: {unique: true, dropDups: true}
    },
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

organizationSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Organization', organizationSchema)
