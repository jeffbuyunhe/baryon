const BAD_REQ = 400
const FORBIDDEN = 403
const UNAUTHORIZED = 401
const SERVER_ERROR = 500
const NOT_FOUND = 404

const GET = 'could not find resource'
const CREATE = 'could not create resource'
const UPDATE = 'could not update resource'
const DESTROY = 'could not delete resource'
const NOT_ADMIN = 'you must be admin to access this resource'
const REPEAT_EMAIL = 'this email has already been used'
const PASSWORD_TOO_SMALL = 'password too small'
const INVALID_CREDS = 'invalid username or password'
const INVALID_TOKEN = 'token not verified'
const NOT_AUTHORIZED = 'user not authorized'
const USER_NOT_FOUND = 'user does not exist'
const SERVER_BREAK = 'server error'
const CSV_ERROR = 'csv error'
const DUPLICATE_COURSE = 'duplicate course code found'
const ORGANIZATION_INVALID = 'invalid organization'
const COURSE_NOT_FOUND = 'course not found'
const GRADE_ASSIGNMENT = 'grade cannot be 0 or empty'
const FILE_NOT_FOUND = 'file not found'
const INVALID_REQUEST = 'invalid request'
const FORUM_NOT_FOUND = 'forum not found'
const DUPLICATE_FORUM = 'duplicate forum'
const DUPLICATE_POST = 'duplicate post'
const POST_NOT_FOUND = 'post not found'

module.exports = {
    errorList: [
        {
            message: GET,
            code: BAD_REQ
        },
        {
            message: CREATE,
            code: BAD_REQ
        },
        {
            message: UPDATE,
            code: BAD_REQ
        },
        {
            message: DESTROY,
            code: BAD_REQ
        },
        {
            message: NOT_ADMIN,
            code: FORBIDDEN
        },
        {
            message: REPEAT_EMAIL,
            code: BAD_REQ
        },
        {
            message: PASSWORD_TOO_SMALL,
            code: BAD_REQ
        },
        {
            message: INVALID_CREDS,
            code: BAD_REQ
        },
        {
            message: INVALID_TOKEN,
            code: BAD_REQ
        },
        {
            message: NOT_AUTHORIZED,
            code: UNAUTHORIZED
        },
        {
            message: USER_NOT_FOUND,
            code: NOT_FOUND
        },
        {
            message: SERVER_BREAK,
            code: SERVER_ERROR
        },
        {
            message: GRADE_ASSIGNMENT,
            code: BAD_REQ
        },
        {
            message: CSV_ERROR,
            code: BAD_REQ
        },
        {
            message: DUPLICATE_COURSE,
            code: BAD_REQ
        },
        {
            message: ORGANIZATION_INVALID,
            code: BAD_REQ
        },
        {
            message: COURSE_NOT_FOUND,
            code: NOT_FOUND
        },
        {
            message:FILE_NOT_FOUND,
            code:NOT_FOUND
        },
        {
            message:INVALID_REQUEST,
            code:BAD_REQ
        },
        {
            message: FORUM_NOT_FOUND,
            code: NOT_FOUND
        },
        {
            message: DUPLICATE_FORUM,
            code: BAD_REQ
        },
        {
            message: DUPLICATE_POST,
            code: BAD_REQ
        },
        {
            message: POST_NOT_FOUND,
            code: NOT_FOUND
        },
    ],
    codes: {
        BAD_REQ,
        FORBIDDEN,
        UNAUTHORIZED,
        SERVER_ERROR,
        NOT_FOUND
    },
    GET,
    CREATE,
    UPDATE,
    DESTROY,
    NOT_ADMIN,
    REPEAT_EMAIL,
    PASSWORD_TOO_SMALL,
    INVALID_CREDS,
    INVALID_TOKEN,
    NOT_AUTHORIZED,
    USER_NOT_FOUND,
    SERVER_BREAK,
    CSV_ERROR,
    DUPLICATE_COURSE,
    ORGANIZATION_INVALID,
    COURSE_NOT_FOUND,
    GRADE_ASSIGNMENT,
    FILE_NOT_FOUND,
    INVALID_REQUEST,
    FORUM_NOT_FOUND,
    DUPLICATE_FORUM,
    DUPLICATE_POST,
    POST_NOT_FOUND
}