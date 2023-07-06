const Note = require('../models/note')

const getAll = async () => {
    const notes = await Note.find({})
    return notes
}

const getOne = async (id) => {
    const note = await Note.findById(id)
    return note? note : null
}

const update = async (id, note) => {
    const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true, runValidators: true })
    return updatedNote
}

const create = async (note) => {
    const newNote = new Note({
        ...note
    })

    const savedNote = await newNote.save()
    return savedNote
}

const destroy = async (id) => {
    await Note.findByIdAndRemove(id)
    return true
}

module.exports = {
    getAll,
    getOne,
    update,
    destroy,
    create
}