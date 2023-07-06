const errors = require('../utils/errors')
const AssignmentSubmission = require('../models/assignmentSubmission')
const Assignment = require('../models/assignment')
const Student = require('../models/student')
const CourseFile = require('../models/courseFile')
const Course = require('../models/course')
const { default: mongoose } = require('mongoose')

const createAssignmentSubmission = async(assignmentId, studentId, uploadedFileId) => {
    
    //check if assignment exists
    
    const existingAssignment = await Assignment.findById(assignmentId)
    if(!existingAssignment) return errors.CREATE
    
    //check if student exists
    const existingStudent = await Student.findById(studentId)
    if(!existingStudent) return errors.USER_NOT_FOUND
    
    //check if encodedFile exists:
    const uploadedFile = await CourseFile.findById(uploadedFileId).exec()
    if(!uploadedFile) return errors.CREATE

    
    //Checks AssignmentSubmission already exists, if so, modify the SubmissionDate and encode file

    const existingAssignmentSubmission = await AssignmentSubmission.findOne({assignmentId:assignmentId,studentId:studentId}).exec()

    if (existingAssignmentSubmission){

        const query = {"assignmentId":assignmentId, "studentId":studentId}
        const updateQuery = { submissionDate:Date(Date.now()), encodedFile: mongoose.Types.ObjectId(uploadedFileId)}//placeholder for encodedFile
        
        const updatedassignmentSubmission = await AssignmentSubmission.findOneAndUpdate(query, updateQuery)

        return updatedassignmentSubmission
    }

    const newAssignmentSubmission = new AssignmentSubmission({
        "assignmentId": mongoose.Types.ObjectId(assignmentId),
        "studentId": mongoose.Types.ObjectId(studentId),
        "encodedFile": mongoose.Types.ObjectId(uploadedFileId),
        "submissionDate": Date(Date.now()),
    })

    const saveAssignmentSubmission = await newAssignmentSubmission.save()

    return saveAssignmentSubmission
}


const gradeAssignmentSubmission = async(assignmentIdString,studentIdString,markObtained,feedback)=> {
    
    //check if this assignment exists
    const assignmentId = mongoose.Types.ObjectId(assignmentIdString)
    let existingAssignment = await Assignment.findById(assignmentId)
    if(!existingAssignment)
        return errors.UPDATE
    
    //check if student exists
    const studentId = mongoose.Types.ObjectId(studentIdString)
    const existingStudent = await Student.findById(studentId)
    if(!existingStudent) return errors.USER_NOT_FOUND
    
    const totalMarks = existingAssignment.totalMark
    if(markObtained > totalMarks)
        return errors.UPDATE
    //check if assignment submission exists
    const existingAssignmentSubmission= await AssignmentSubmission.findOne({assignmentId:assignmentId,studentId:studentId}).exec()
    
    if(!existingAssignmentSubmission)
        return errors.GET
    
    const query = {assignmentId:assignmentId, studentId:studentId}
    const updateQuery = {markObtained :markObtained, feedback: feedback}//placeholder for encodedFile
    
    await AssignmentSubmission.updateOne(query, updateQuery, {multi:true});
    
    //return the graded Assignment Submission object
    const gradedAssignment = await AssignmentSubmission.findOne({assignmentId:assignmentId,studentId:studentId}).exec()
    
    return gradedAssignment

}



const getAllAssignmentSubmission = async() =>{
    const allassignmentSubmission = await AssignmentSubmission.find({})
    return allassignmentSubmission
}

const getSpecificAssignmentSubmission = async(assignmentId,studentId) =>{
    const existingAssignmentSubmission= await AssignmentSubmission.findOne({assignmentId:assignmentId,studentId:studentId}).exec()
    return existingAssignmentSubmission ? existingAssignmentSubmission : null
}


const getAllAssignmentSubmissionStudent = async(studentId) =>{
    //check if student exists:
    const existingStudent = await Student.findById(studentId).exec();
    if(!existingStudent) return errors.GET;

    const existingAssignmentSubmission= await AssignmentSubmission.find({studentId:studentId}).exec()
    return existingAssignmentSubmission? existingAssignmentSubmission : errors.GET
}

const getAllAssignmentSubmissionSpecific = async(courseId, assignmentId) =>{
    //check if course exists:
    const existstingCourse = await Course.findById(courseId)
    if(!existstingCourse) return errors.GET;

    const listStudents = existstingCourse.students;
    const listAssignmentSubmission = [];
    for (const student of listStudents){
        const assignmentSubmissions = await AssignmentSubmission.findOne({studentId:student, assignmentId:assignmentId}).exec()
        //if a student has submission, add to the list
        if(assignmentSubmissions) listAssignmentSubmission.push(assignmentSubmissions);
    }
    return listAssignmentSubmission;
}



module.exports = {
    createAssignmentSubmission,
    gradeAssignmentSubmission,
    getAllAssignmentSubmission,
    getSpecificAssignmentSubmission,
    getAllAssignmentSubmissionStudent,
    getAllAssignmentSubmissionSpecific
}