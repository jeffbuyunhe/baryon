const logger = require('./logger')
const errors = require('./errors')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Course = require('../models/course')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')
const config = require('./config')
const Instructor = require('../models/instructor')
const Student = require('../models/student')
const Forum = require('../models/discussionBoard')
const Post = require('../models/post')
const Comment = require('../models/comment')

const requestLogger = (req, res, next) => {
    logger.info('Method:', req.method)
    logger.info('Path:  ', req.path)
    logger.info('Body:  ', req.body)
    logger.info('----------------------')
    next()
}

const tokenExtractor = (req) => {
    const authorization = req.get('Authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    } else {
        return null
    }
}

const userExtractor = async (req, res, next) => {
    const token = tokenExtractor(req)
    if(token) {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) throw Error(errors.INVALID_TOKEN)
        const user = await User.findById(decodedToken.id)

        // spread syntax not working here :( I'm not sure why
        req.user = {}
        req.user.firstname = user.firstname
        req.user.lastname = user.lastname
        req.user.email = user.email
        req.user.password = user.password
        req.user.isAdmin = user.isAdmin
        req.user.organizationId = user.organizationId
        req.user.accountStatus = user.accountStatus
        req.user.date = user.date
        req.user.id = user._id
    } else {
        req.user = null
    }
    next()
}

const isAdmin = async (req, res, next) => {
    if(!req.user) throw Error(errors.NOT_AUTHORIZED)
    if(!req.user.isAdmin) throw Error(errors.NOT_AUTHORIZED)
    next()
}

const isAdminOrAuth = async (req, res, next) => {
    if(!req.user) throw Error(errors.NOT_AUTHORIZED)

    if(!req.user.isAdmin && !req.isAuthenticated) throw Error(errors.NOT_AUTHORIZED)
    next()
}

const isInstructor = async (req, res, next) => {
    if(!req.user) throw Error(errors.NOT_AUTHORIZED)

    const ins = await Instructor.findById(req.user.id)
    if(!ins) throw Error(errors.NOT_AUTHORIZED)

    if(ins.courses.some(course => course.equals(req.params.courseid))) next()
    else throw Error(errors.NOT_AUTHORIZED)

}

const isInstructorOrAuth = async (req, res, next) => {
    if(!req.user) throw Error(errors.NOT_AUTHORIZED)

    if(!req.isAuthenticated){
        const ins = await Instructor.findById(req.user.id)
        if(!ins) throw Error(errors.NOT_AUTHORIZED)

        if(ins.courses.some(course => course.equals(req.params.courseid))){
            req.isAuthenticated = true
            next()
        }else{
            throw Error(errors.NOT_AUTHORIZED)
        }
    }
    next()
}

// used to check if user is student/admin/instructor in course with courseid
const isMember = async (req, res, next) => {
    if(!req.user) throw Error(errors.NOT_AUTHORIZED)
    const ins = await Instructor.findById(req.user.id)

    if(!ins) {
        const stu = Student.findById(req.user.id)
        if(stu && stu.courses.some(course => course.equals(req.params.courseid))) next()
        if(stu && stu.taCourses.some(course => course.equals(req.params.courseid))) next()
        else throw Error(errors.NOT_AUTHORIZED)
    }

    if(ins.courses.some(course => course.equals(req.params.courseid))) next()
    else throw Error(errors.NOT_AUTHORIZED)
}

// used to check if user is student/admin/instructor in course with courseid
const isAnyMemberType = async (req, res, next) => {
    if(!req.user) throw Error(errors.NOT_AUTHORIZED)

    // this middleware is used by post and get requests
    const courseid = (req.params && req.params.courseid) ? req.params.courseid : req.body.courseid

    const courseObj = await course.findById(courseid)

    //check if user is admin in course's org
    if((req.user.organizationId.toString() === courseObj.organizationId.toString()) && req.user.isAdmin) next()

    const ins = await instructor.findById(req.user.id)

    if(!ins) {
        const stu = student.findById(req.user.id)
        if(stu && stu.courses.some(course => course.equals(courseid))) next()
        else throw Error(errors.NOT_AUTHORIZED)
    }

    if(ins.courses.some(course => course.equals(courseid))) next()
    else throw Error(errors.NOT_AUTHORIZED)
}

const isPostAuthor = async (req, res, next) => {
    if(!req.user) throw Error(errors.NOT_AUTHORIZED)

    // used by put and get requests
    const postId = (req.body.postId) ? req.body.postId : req.params.id

    const postRes = await Post.findById(postId)

    //check if they are instructor or org admin
    if(postRes.author.toString() !== req.user.id.toString()){
        throw new Error(errors.NOT_AUTHORIZED)
    }
    req.isAuthenticated = true
    next()
}

const isCommentAuthor = async(req, res, next) => {
    if(!req.user) throw Error(errors.NOT_AUTHORIZED)

    // used by put and get requests
    const commentId = (req.body.postId) ? req.body.postId : req.params.id

    const commentRes = await Comment.findById(commentId)

    if(commentRes.userId.toString() != req.user.id.toString()) {
        throw new Error(errors.NOT_AUTHORIZED)
    }

    req.isAuthenticated = true
    next()

}

const postExists = async (req, res, next) => {

    if(!req.body.forumId) throw Error(errors.FORUM_NOT_FOUND)

    const postForum = await Forum.findById(req.body.forumId, {posts: 1})

    if(!postForum) throw Error(errors.FORUM_NOT_FOUND)

    const postPromises = postForum.posts.map(postId => Post.findById(postId.toString(), {title: 1}))

    const posts = await Promise.all(postPromises)

    if(posts.some(postObj => postObj.title === req.body.title)) throw Error(errors.DUPLICATE_POST)

    next()

}

const isAuthenticated  = async (req, res, next) => {
    if(!req.user) throw Error(errors.NOT_AUTHORIZED)
    next()
}

const errorHandler = (err, req, res, next) => {
    if(err.message) {
        for(let i = 0; i < errors.errorList.length; i++) {
            if(err.message == errors.errorList[i].message) {
                return res.status(errors.errorList[i].code).json({error: err.message})
            }
        }
    }
    return res.status(errors.codes.SERVER_ERROR).json({error: 'server error'})
}

//middleware for course upload header parsing
const courseFileInfo = async (req,res,next) =>{
    req.courseId = req.get("courseId")
    req.uploaderId = req.get("uploaderId")
    try{
        const course = await Course.findById(req.courseId)
        const user = await User.findById(req.uploaderId)

    if(!course && !user){
        res.status(errors.codes.BAD_REQ).json({error:errors.INVALID_REQUEST})
        return;
    }
    }catch(err){
        res.status(errors.codes.BAD_REQ).json({error:errors.INVALID_REQUEST})
        return;
    }

    next()
}

//The middleware for multer-gridfs-storage
const storage = new GridFsStorage({
    url: config.MONGODB_URI,
    file: (req, file) => {
        return {
            bucketName: 'coursefiles',       //Setting collection name, default name is fs
            filename: file.originalname     //Setting file name to original name of file
        }
    }
  });

  //This middleware parses multiple files with debugging help
const courseFileUploadArray = (req, res, next) => {

    const upload = multer({storage}).array('file')

    upload(req, res, function(err){
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            const err = new Error('Multer error');
            return err
            } else if (err) {
            // An unknown error occurred when uploading.
            const err = new Error('Server Error')
            return err
          }
     
         // Everything went fine.
         next()
    })
}

const courseFileUpload = (multer({storage}))


module.exports = {
    requestLogger,
    errorHandler,
    userExtractor,
    isAdmin,
    isAuthenticated,
    courseFileUploadArray,
    courseFileUpload,
    courseFileInfo,
    isInstructor,
    isMember,
    postExists,
    isPostAuthor,
    isCommentAuthor,
    isInstructorOrAuth,
    isAdminOrAuth,
    isAnyMemberType
}