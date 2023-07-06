const Course = require('../models/course')
const CourseFile = require('../models/courseFile')
const CourseMedia = require('../models/courseMedia')
const errors = require('../utils/errors')
const mongoose = require('mongoose')

const getAll = async () => {
    const med = await CourseMedia.find({})
    return med
}

const getOne = async (id) => {
    const med = await CourseMedia.findById(id)
    return med? med : null
}

const update = async (id, inputs) => {
  const med = await CourseMedia.findById(id);
  if(med==null)return errors.UPDATE
  const updatedMed = await CourseMedia.findByIdAndUpdate(id, inputs, { new: true, runValidators: true })
  return updatedMed
}


const create = async (med) => {
    const newMedia = new CourseMedia({
        ...med
    })
    return await newMedia.save()
}

const destroy = async (id) => {
    const mat = await CourseMedia.findById(id);
    if(mat==null)return errors.DESTROY
    await CourseMedia.findByIdAndRemove(id);
    return true
}

module.exports = {
    getAll,
    getOne,
    update,
    destroy,
    create
}