const Announcement = require('../models/announcement')
const Student = require('../models/student')
const Course = require('../models/course')
const emailService = require('../utils/email/emailService')
const emailTypes = require('../utils/email/emailTypes')
const errors = require('../utils/errors')

// gets all announcements for a course
const getCourseAnnouncement = async (cid) => {
    const announcements = await Announcement.find({
        courseId: cid
    })

    return announcements
}

// gets single announcement with id
const getOne = async (id, user) => {
    const announcement = await Announcement.findById(id)
    if(announcement && announcement.organizationId.equals(user.organizationId)) return announcement
    return null
}

// gets all announcements for a student
const getForStudent = async (id) => {
    const student = await Student.findById(id)
    if(!student) return errors.USER_NOT_FOUND

    let announcements = []
    for(const course of student.courses) announcements = [...announcements, ...await Announcement.find({courseId: course})]

    return announcements
}

// creates announcement
const create = async (announcement, cid, user) => {
    const a = new Announcement({
        ...announcement,
        courseId: cid,
        organizationId: user.organizationId,
        instructorId: user.id
    })

    const course = await Course.findById(cid)
    const users = await Student.find({
        courses: { $in: [cid] }
    }).populate('_id')

    users.forEach(async (u) => {
        await emailService.send(u._id.email, emailTypes.ANNOUNCEMENT.subject, {
            announcement: announcement.announcement,
            name: u.name,
            instructor: `${user.firstname} ${user.lastname}`,
            course: course.name
        }, emailTypes.ANNOUNCEMENT.template)
    })

    return await a.save()
}

// update an announcement
const update = async (announcement, cid, id, user) => {
    const a = await Announcement.findByIdAndUpdate(id, {
        ...announcement,
        organizationId: user.organizationId,
        courseId: cid
    }, { new: true, runValidators: true })

    return a
}

// deletes an announcement
const destroy = async (id) => {
    await Announcement.findByIdAndRemove(id)
    return true
}

module.exports = {
    getOne,
    destroy,
    create,
    getCourseAnnouncement,
    getForStudent,
    update
}