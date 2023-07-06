const Course = require('../models/course')
const CourseFile = require('../models/courseFile')
const CourseMaterial = require('../models/courseMaterial')
const errors = require('../utils/errors')
const mongoose = require('mongoose')
const courseMaterial = require('../models/courseMaterial')

const getAll = async () => {
    const mat = await CourseMaterial.find({})
    return mat
}

const getOne = async (id) => {
    const mat = await CourseMaterial.findById(id)
    return mat? mat : null
}

const update = async (id, inputs) => {
  const mat = await CourseMaterial.findById(id);
  if(mat==null)return errors.UPDATE
  const updatedMat = await CourseMaterial.findByIdAndUpdate(id, inputs, { new: true, runValidators: true })
  return updatedMat
}


const create = async (mat) => {
    const newMaterial = new CourseMaterial({
        ...mat
    })
    return await newMaterial.save()
}

const getByCourseId = async (id) => {

    const courseId = mongoose.Types.ObjectId(id)

    if(!courseId ) return errors.GET 

    try{

        const materialIds = await courseMaterial.find(  
            {
                'courseId': courseId,
            },
            {
                'title' : 1,
                'label': 1,
                'courseFileId': 1,
                '_id': 1
            }
        )

       return materialIds 

    }catch(err){
        console.log(err)
        return errors.GET
    }

}

const destroy = async (id) => {
    const mat = await CourseMaterial.findById(id);
    if(mat==null)return errors.DESTROY
    await CourseMaterial.findByIdAndRemove(id);
    return true
}

module.exports = {
    getAll,
    getOne,
    update,
    destroy,
    create,
    getByCourseId
}