const errors = require('../utils/errors')
const Assignment = require('../models/assignment')
const Course = require('../models/course')
const Student = require('../models/student')
const { default: mongoose } = require('mongoose')
//service to create an assingment for student in the course
const create = async(courseId,courseFileId, title,dueDate,weight, totalMark) => {
    
    //check course exists
    const existingCourse = await Course.findOne({id:courseId}).exec()
    if (!existingCourse){
        return errors.CREATE;
    }

    //create assignment without related CourseFileId
    if(courseFileId == null){
        const newAssignment = new Assignment({
            "title": title,
            "dueDate": new Date(dueDate),
            "weight": weight,
            "totalMark": totalMark,
            "courseId":mongoose.Types.ObjectId(courseId),
        })
        
        const createdAssignment = await newAssignment.save()
        
        
        return createdAssignment
    }else{
        //check if assignment is already created for related courseFileId
        const existingAssignment = await Assignment.findOne({courseId:courseId,courseFileId:courseFileId}).exec()
        if (existingAssignment){
            return errors.CREATE;
        }    
    }

    
    const newAssignment = new Assignment({
        "title": title,
        "dueDate": new Date(dueDate),
        "weight": weight,
        "totalMark": totalMark,
        "courseId":mongoose.Types.ObjectId(courseId),
        "courseFileId":courseFileId
    })
    
    const createdAssignment = await newAssignment.save()
    
    
    return createdAssignment

}


const getCourseAll = async(courseId) => {
    //check course exists
    const existingCourse = await Course.findOne({id:courseId}).exec()
    if (!existingCourse){
        return errors.GET;
    }
    
    const assignments = await Assignment.find({courseId:courseId})
    return assignments
}


const getStudentAll = async(studentId) =>{
    //check student exists
    const existingStudent = await Student.findOne({id:studentId}).exec()
    const listAssignment = [];
    if (!existingStudent){
        return errors.GET;
    }

    const courses = (await Student.findOne({id:studentId}).exec()).courses
    

    for(const x of courses){
        //check if course exists
        const existingCourse = await Course.findOne({id:x}).exec()
        if (existingCourse){
            const assignments = await Assignment.find({courseId:x})
            for(const assign of assignments){
                listAssignment.push(assign)
            }
        }
    }
    return listAssignment

}


const getStudentInCourse = async(studentId,courseId) =>{
    //check student exists
    const existingStudent = await Student.findOne({id:studentId}).exec()
    const listAssignment = [];
    if (!existingStudent){
        return errors.GET;
    }

    const courses = (await Student.findOne({id:studentId}).exec()).courses
    const isInCourses = courses.some(function(course){
        return course.equals(mongoose.Types.ObjectId(courseId))
    });

    if(isInCourses){
        const assignments = await Assignment.find({courseId:courseId})
        for(const assign of assignments){
            listAssignment.push(assign)
        }
        return listAssignment
    }
    
    return errors.GET

}


const deleteAssignment = async(assignmentId) =>{
    const existingAssignment = await Assignment.findOne({id:assignmentId}).exec()
    if(!existingAssignment)
        return errors.DESTROY
    await Assignment.findByIdAndRemove(assignmentId)
    return "Delete Assignment Successful"
}


const updateAssignment = async(assignmentId, title,dueDate,weight, totalMark ) =>{
    const existingAssignment = await Assignment.findOne({id:assignmentId}).exec()
    if(!existingAssignment)
    return errors.UPDATE
    
    let newTitle = existingAssignment.title;
    let newDueDate = existingAssignment.dueDate;
    let newWeight = existingAssignment.weight;
    let newTotalMark = existingAssignment.totalMark;
    
    if(title) newTitle = title;
    if(dueDate) newDueDate = dueDate;
    if(weight) newWeight = weight;
    if(totalMark) newTotalMark = totalMark;
    
    const query = {assignmentId:assignmentId}
    const updateQuery = {title:newTitle,dueDate:newDueDate,weight:newWeight,totalMark:newTotalMark}

    await Assignment.findOneAndUpdate(query, updateQuery)
    
    const updatedAssignment = await Assignment.findOne({id:assignmentId}).exec()
    return updatedAssignment

}




module.exports = {
    create,
    getCourseAll,
    getStudentAll,
    getStudentInCourse,
    deleteAssignment,
    updateAssignment
}