//this is a gridFs driver to talk to the gridFs system
const CourseFile = require('../models/courseFile')
const User = require('../models/user')
const Course = require('../models/course')
const errors = require('../utils/errors')
const mongoose = require('mongoose')
let gridDriver;
let conn = mongoose.connection

/* Creating a connection to the gridFs system. */
conn.once('open',()=>{
    gridDriver = new mongoose.mongo.GridFSBucket(conn.db,{bucketName:'coursefiles'})
    //console.log("Connection to GRIDFS")
})

//get all files
const getAll = async () => {
    const file = await CourseFile.find({})
    return file
}
//get one file by id
const getOne = async (id) => {
    const file = await CourseFile.findById(id)
    return file? file : null
}
//create a file with metadata of uploaded file
const upload = async (fileJson) => {
    const file = new CourseFile(fileJson)
    return await file.save();
}

//create many files with metadata of uploaded files
const uploadMany = async (fileJSONs) => {
    try{
        
        const files = await CourseFile.insertMany(fileJSONs)
        return files
    }catch(err){
        return errors.CREATE
    }

}
//remove all file metadata and actual data chunks
const destroy = async(idString) =>{
    try{
    const id = mongoose.Types.ObjectId(idString)
    await CourseFile.findOneAndDelete({'_id':id})
    await gridDriver.delete(id)
    }catch(err){
        return errors.DESTROY
    }
}
//return a download stream for the time
const download = async(id) =>{
    try{
    validRequest = await gridDriver.find({_id:mongoose.Types.ObjectId(id)}).toArray()
    if(validRequest.length==0 || id == null){return errors.FILE_NOT_FOUND}

    return await gridDriver.openDownloadStream(mongoose.Types.ObjectId(id))
    }
    catch(err){return errors.FILE_NOT_FOUND}
}
module.exports = { 
    getAll,
    getOne,
    upload,
    download,
    uploadMany,
    destroy
}