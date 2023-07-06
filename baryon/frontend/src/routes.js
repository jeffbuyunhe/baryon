// ! This file contains the routes used across the app

export const PAGES = {
    login: {
        title: 'Login',
        path: '/login'
    },
    homePage:{
        title: 'Home Page',
        path: "/homepage"
    },
    signup: {
        title: 'Sign Up',
        path: '/signup'
    },
    signupsuccess: {
        title: 'Sign Up Success',
        path: '/signupsuccess'
    },
    adminHome: {
        title: 'Admin Home Page',
        path: '/admin'
    },
    courses: {
        title: 'Courses',
        path: '/courses'
    },
    adminUpload: {
        title: 'Admin Upload Page',
        path: '/admin/upload'
    },
    adminManageCourse: {
        title: 'Admin Manage Course Page',
        path: '/admin/course'
    }
}

export const COURSE = {
    home: {
        title: 'Home',
        path: '/home'
    },
    assignments: {
        title: 'Assignments',
        path: '/assignments'
    },
    studentAssignment: {
        title: 'Assignments',
        path: '/student_assignments'
    },
    grades: {
        title: 'Grades',
        path: '/grades'
    },
    gradesAssignment: {
        title: 'Grades',
        path: '/grades/:id'
    },
    media : {
        title: 'Media',
        path: '/media'
    }
}
