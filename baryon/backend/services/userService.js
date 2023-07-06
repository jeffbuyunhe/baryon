const User = require('../models/user')
const bcrypt = require('bcrypt')
const errors = require('../utils/errors')
const jwt = require('jsonwebtoken')
const Token = require('../models/token')
const TokenTypes = require('../utils/tokenTypes')
const AccountStatus = require('../utils/accountStatus')
const crypto = require("crypto")
const UserTypes = require('../utils/userTypes')
const emailService = require('../utils/email/emailService')
const organizationService = require('./organizationService')
const emailTypes = require('../utils/email/emailTypes')

const SALT = 10

// get all users
const getAll = async () => {
    const users = await User.find({})
    return users
}

// get single user with id
const getOne = async (id) => {
    const user = await User.findById(id)
    return user? user : null
}

// update a user
const update = async (id, user, reqUser) => {
    const u = await User.findById(id)
    // if not admin can only change first and last name here
    let updates = {
        firstname: user.firstname,
        lastname: user.lastname,
    }

    if(reqUser.isAdmin && reqUser.organizationId.equals(u.organizationId)) updates.organizationId = user.organizationId
    // verify permissions
    if(id.equals(reqUser.id) || (reqUser.isAdmin && (reqUser.organizationId.equals(u.organizationId)))) {
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
        return updatedUser
    } else {
        return errors.NOT_AUTHORIZED
    }
}

// create a user
const create = async (user, type) => {
    if(!user.organizationId) return(errors.CREATE)
    const password = user.password
    let newUser = null

    // verify does not already exist with email
    const existingUser = await User.findOne({ email: user.email })
    if (existingUser) return errors.REPEAT_EMAIL

    // if user has password (may not since admin can register users)
    if(password) {
        if (password.length < 8) return errors.PASSWORD_TOO_SMALL

        // hash passwords with bcrypt
        const passwordHash = await bcrypt.hash(password, SALT)

        newUser = new User({
            ...user,
            password: passwordHash,
        })
    } else {
        newUser = new User({
            ...user,
        })
    }

    if(type == UserTypes.Admin) {
        newUser.isAdmin = true
        newUser.accountStatus = AccountStatus.Registered
    }

    const savedUser = await newUser.save()

    // generate account activation token
    const activationToken = crypto.randomBytes(32).toString("hex")

    const token = await bcrypt.hash(activationToken, SALT)
    const t = new Token({
        user: savedUser._id,
        token: token,
        createdAt: Date.now(),
        tokenType: TokenTypes.AccountActivation
    })

    await t.save()

    const org = await organizationService.getOne(user.organizationId)
    if(type == UserTypes.Admin) {
        await emailService.send(savedUser.email, emailTypes.WELCOME_ADMIN.subject, {
            name: savedUser.firstname,
            organization: org.name
        }, emailTypes.WELCOME_ADMIN.template)
    } else {
        await emailService.send(savedUser.email, emailTypes.WELCOME.subject, {
            name: savedUser.firstname,
            link: `${process.env.FRONTEND_URL}/login?token=${activationToken}&id=${savedUser._id}`,
            organization: org.name
        }, emailTypes.WELCOME.template)
    }
    
    return savedUser
}

// delete user with id
const destroy = async (id, reqUser) => {
    const u = User.findById(id)
    const email = u.email
    const name = u.name
    // verify permissions
    if(id.equals(reqUser.id) || (reqUser.isAdmin && (reqUser.organizationId.equals(u.organizationId))))
        await User.findByIdAndRemove(id)
    else return errors.NOT_AUTHORIZED

    await emailService.send(email, emailTypes.ACCOUNT_DELETED.subject, {
        name: name
    }, emailTypes.ACCOUNT_DELETED.template)

    return true
}

// log user in
const login = async (creds) => {
    // verify user exists
    const user = await User.findOne({ email: creds.email })
    if (!user) return errors.INVALID_CREDS

    // check password
    const passwordCorrect = await bcrypt.compare(creds.password, user.password)
    if (!passwordCorrect) return errors.INVALID_CREDS

    const userForToken = {
        id: user._id,
        email: user.email
    }

    // return jwt for later auth (valid for 1 week)
    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60*24*7 })
    return { token, email: user.email, name: `${user.firstname} ${user.lastname}`, timestamp: new Date(), id: user._id, isAdmin: user.isAdmin }
}

// allows user to reset password
const passwordReset = async (email) => {
    // verify user exists
    const user = await User.findOne({ email: email })
    if (!user) return errors.USER_NOT_FOUND

    // if already issued tokent then delete and issue new
    const token = await Token.findOne({ user: user._id, tokenType: TokenTypes.PasswordReset })
    if (token) await Token.findByIdAndRemove(token._id)

    // generate token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const newToken = await bcrypt.hash(resetToken, SALT)

    const res = new Token({
        user: user._id,
        token: newToken,
        createdAt: Date.now(),
        tokenType: TokenTypes.PasswordReset
    })

    await res.save()

    await emailService.send(email, emailTypes.CHANGE_PASSWORD_REQUEST.subject, {
        name: user.name,
        link: `${process.env.FRONTEND_URL}?token=${resetToken}&id=${user._id}`
    }, emailTypes.CHANGE_PASSWORD_REQUEST.template)

    return { token: resetToken }
}

// allows user to change password
const passwordResetConfirm = async (id, token, password) => {
    if (password.length < 8) return errors.PASSWORD_TOO_SMALL

    // finds token
    const resetToken = await Token.findOne({ user: id, tokenType: TokenTypes.PasswordReset })
    if (!resetToken) return errors.INVALID_TOKEN

    // compares token with the request token
    const valid = await bcrypt.compare(token, resetToken.token)
    if (!valid) return errors.INVALID_TOKEN

    // hash new password
    const passwordHash = await bcrypt.hash(password, SALT)
    const u = await User.findByIdAndUpdate(id, {
        password: passwordHash
    }, { new: true, runValidators: true })

    await Token.findByIdAndRemove(resetToken._id)

    await emailService.send(email, emailTypes.CHANGE_PASSWORD_CONFIRM.subject, {
        name: u.name,
    }, emailTypes.CHANGE_PASSWORD_CONFIRM.template)

    return true
}

// allows user to reset email
const emailReset = async (id, newEmail, user) => {
    if (user.id != id) return errors.NOT_AUTHORIZED

    const u = await User.findByIdAndUpdate(id, {
        email: newEmail
    }, { new: true, runValidators: true })

    await emailService.send(newEmail, emailTypes.CHANGE_EMAIL.subject, {
        name: u.name,
    }, emailTypes.CHANGE_EMAIL.template)

    return u
}

// allows user to activate account
const activate = async (id, password, token) => {
    // finds activation token
    const activationToken = await Token.findOne({ user: id, tokenType: TokenTypes.AccountActivation })
    if (!activationToken) return errors.INVALID_TOKEN

    // verify token is valid
    const valid = await bcrypt.compare(token, activationToken.token)
    if (!valid) return errors.INVALID_TOKEN

    let user = null

    if(password) {
        if (password.length < 8) return errors.PASSWORD_TOO_SMALL
        // hash passwords with bcrypt
        const passwordHash = await bcrypt.hash(password, SALT)
        // activate account
        user = await User.findByIdAndUpdate(id, {
            accountStatus: AccountStatus.Registered,
            password: passwordHash
        }, { new: true, runValidators: true })
    } else {
        // activate account
        user = await User.findByIdAndUpdate(id, {
            accountStatus: AccountStatus.Registered,
        }, { new: true, runValidators: true })
    }

    await activationToken.deleteOne()
    return user
}

// returns whether user is verified or not
const isVerified = async (email) => {
    const user = await User.findOne({email: email})
    // check if user exists
    if(!user) return errors.USER_NOT_FOUND

    return {
        verified: user.accountStatus == AccountStatus.Registered
    }
}

// returns the current logged in user
const currentUser = async (id) => await User.findById(id)

module.exports = {
    getAll,
    getOne,
    update,
    destroy,
    create,
    login,
    passwordReset,
    passwordResetConfirm,
    emailReset,
    activate,
    isVerified,
    currentUser
}