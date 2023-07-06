const Course = require('../models/course')
const Instructor = require('../models/instructor')
const Organization = require('../models/organization')
const User = require('../models/user')
const Student = require('../models/student')
const errors = require('../utils/errors')
const mongoose = require('mongoose')

const getAll = async () => {
    const course = await Course.find({})
    return course
}

const getOne = async (id) => {
    const course = await Course.findById(id)
    return course? course : null
}

const getAllByOrganizationId = async (orgId) => {
    const courses = await Course.find({organizationId: mongoose.Types.ObjectId(orgId)})
    return courses
}

const removeUsers = async(id,inputs) =>{
    const {students,instructors} = inputs;
    const oldCourse = await Course.findById(id)
    if(!oldCourse)return errors.COURSE_NOT_FOUND;
            //remove students
            if(students&&students.length>0){
                for(let i=0;i<students.length;i++){
                    let s = await Student.findById(students[i]);
                    let u = await User.findById(students[i]);
                    if(s && u){
                        await Course.findByIdAndUpdate(id,{$pull:{students:u._id}},{new: true, runValidators: true})
                        await Student.findByIdAndUpdate(students[i],{$pull:{courses:oldCourse._id}},{new: true, runValidators: true})
                    }
                }
            }

            //remove instructors / tas
            if(instructors&&instructors.length>0){
                for(let i=0;i<instructors.length;i++){
                    let s = await Instructor.findById(instructors[i]);
                    let u = await User.findById(instructors[i]);
                    if(s && u && u.organizationId.toString() == oldCourse.organizationId.toString()){
                        await Course.findByIdAndUpdate(id,{$pull:{instructors:u._id}},{new: true, runValidators: true})
                        await Instructor.findByIdAndUpdate(instructors[i],{$pull:{courses:oldCourse._id}},{new: true, runValidators: true})
                    }else{
                        s = await Student.findById(instructors[i]);
                    if(s && u){
                        await Course.findByIdAndUpdate(id,{$pull:{instructors:u._id}},{new: true, runValidators: true})
                        await Student.findByIdAndUpdate(instructors[i],{$pull:{taCourses:oldCourse._id}},{new: true, runValidators: true})
                    }
                    }
                }
            }
             return await Course.findById(id);
}

const addUsers = async(id,inputs) =>{
    const {students,instructors} = inputs;
    const oldCourse = await Course.findById(id)
    if(!oldCourse)return errors.COURSE_NOT_FOUND;
            //add students
            if(students&&students.length>0){
                for(let i=0;i<students.length;i++){
                    let s = await Student.findById(students[i]);
                    let u = await User.findById(students[i]);
                    if(s && u && u.organizationId.equals(oldCourse.organizationId)){
                        await Course.findByIdAndUpdate(id,{$addToSet:{students:u._id}},{new: true, runValidators: true})
                        await Student.findByIdAndUpdate(students[i],{$addToSet:{courses:oldCourse._id}},{new: true, runValidators: true})
                    }
                }
            }

            //add instructors / tas
            if(instructors&&instructors.length>0){
                for(let i=0;i<instructors.length;i++){
                    let s = await Instructor.findById(instructors[i]);
                    let u = await User.findById(instructors[i]);
                    //if instructor
                    if(s && u && u.organizationId.equals(oldCourse.organizationId)){
                        await Course.findByIdAndUpdate(id,{$addToSet:{instructors:u._id}},{new: true, runValidators: true})
                        await Instructor.findByIdAndUpdate(instructors[i],{$addToSet:{courses:oldCourse._id}},{new: true, runValidators: true})
                    }else{
                        //if TA
                         s = await Student.findById(instructors[i]);
                    if(s && u && u.organizationId.equals(oldCourse.organizationId)){
                        await Course.findByIdAndUpdate(id,{$addToSet:{instructors:u._id}},{new: true, runValidators: true})
                        await Student.findByIdAndUpdate(instructors[i],{$addToSet:{taCourses:oldCourse._id}},{new: true, runValidators: true})
                    }
                    }
                }
            }
            return await Course.findById(id);
}

const update = async (id, inputs) => {
    let course = await Course.findById(id);
    if(!course)return errors.COURSE_NOT_FOUND;
    let updates = {
        name:inputs.name,
        courseCode:inputs.courseCode,
        organizationId:inputs.organizationId
    }

    //check if organization exists
    if(updates.organizationId&&!(await Organization.findById(inputs.organizationId)))
    {
         return errors.ORGANIZATION_INVALID
    }

    //dont let it overlap with another course with same organizationId and courseCode
    if(!updates.organizationId)updates.organizationId=course.organizationId;//this line helps fulfill duplicates check
    let duplicates = await Course.find({courseCode:updates.courseCode,organizationId:updates.organizationId,_id:{$ne: course._id}});
    if(duplicates && duplicates.length>0){
        return errors.COURSE_NOT_FOUND
    }


    //remove everything if organizationId change
    if(!(course.organizationId.equals(updates.organizationId))){
            //remove from student taking list and taing list
            await Student.updateMany({},{$pull:{courses:c._id}})
            await Student.updateMany({},{$pull:{taCourses:c._id}})
            //remove from instructor's list
            await Instructor.updateMany({},{$pull:{courses:c._id}})
    }

    const updatedCourse = await Course.findByIdAndUpdate(id,updates,{ new: true, runValidators: true });
    return updatedCourse
}

const create = async (course) => {

    let newCourse = new Course({
        ...course
    })

    newCourse.students = []
    newCourse.instructors = []
    //organization exists
    if(!(await Organization.findById(course.organizationId))){
        return errors.ORGANIZATION_INVALID
    }
    //code has to be unique within organization
    let duplicates = await Course.find({courseCode:course.courseCode,organizationId:course.organizationId});
    if(duplicates && duplicates.length>0){
        return errors.DUPLICATE_COURSE
    }
    const savedCourse = await newCourse.save()
    return savedCourse
}

const addLabel = async (id, inputs) => {
    if(!inputs.label) return errors.UPDATE


    try{
        await Course.findByIdAndUpdate(id, {$addToSet: {labels: inputs.label}},{ new: true, runValidators: true })
    }catch(err) {
        console.log(err)
        return errors.UPDATE
    }
    const updatedCourse = await Course.findById(id);
    return updatedCourse
}

const destroy = async (id) => {
    const c = await Course.findById(id);
    //remove from student taking list and taing list
    await Student.updateMany({},{$pull:{courses:c._id}})
    await Student.updateMany({},{$pull:{taCourses:c._id}})
    //remove from instructor's list
    await Instructor.updateMany({},{$pull:{courses:c._id}})
    await Course.findByIdAndRemove(id)

    return true
}

module.exports = {
    getAll,
    getAllByOrganizationId,
    getOne,
    update,
    destroy,
    create,
    addUsers,
    addLabel,
    removeUsers
}