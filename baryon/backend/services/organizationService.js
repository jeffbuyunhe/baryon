const Organization = require('../models/organization')
const { listenerCount } = require('../models/user')

const User = require('../models/user')

// create an organization
const create = async (req, user) => {
    const {name} = req

    const newOrg = new Organization({
        name: name,
    })

    const savedOrg = await newOrg.save()

    return savedOrg
}

// get all orgs
const getAll = async () => {
    const orgs = await Organization.find({})
    return orgs
}

//get one by ID
const getOne = async (id) => {
    const org = await Organization.findById(id)
    return org? org : null
}

//get one by name
const getOneByName = async (orgName) => {

    const org = await Organization.findOne({name: orgName})
    return org? org : null
}

//updates organization given by ID
const update = async (id, update) => {
    const {name, admins, updateValue} = update

    // queries user collection for ids that belong to admins
    // only admins will be updated in the corresponding list
    let realAdmins = await User.find({$and: [{isAdmin: true}, {'_id': {$in : admins}}] }, {"_id": 1})

    if(realAdmins.length > 0){
        realAdmins = realAdmins.map(x => x._id.toString())
    }

    let updatedOrg

    if(name){
        updatedOrg = await Organization.findByIdAndUpdate(id, {$set: {name: name}}, {new: true, runValidators: true})
    }

    if(realAdmins && realAdmins.length > 0){

            // remove from array
            // returns org if admins not in array
        if(updateValue && updateValue == 1){
            updatedOrg = await Organization.findByIdAndUpdate(id, {$pull: {admins: {$in: realAdmins}}}, {new: true, runValidators: true})

            //add to array
            //does not add duplicates
        }else if(updateValue && updateValue == 2){
            updatedOrg = await Organization.findByIdAndUpdate(id, {$addToSet: {admins: realAdmins }}, {new: true, runValidators: true})

            //default to setting array
        }else{
            updatedOrg = await Organization.findByIdAndUpdate(id, {admins: realAdmins}, {new: true, runValidators: true})
        }


    }else{
        // return if there is nothing to update
        updatedOrg = await Organization.findById(id)
    }

    return updatedOrg
}

// destory Organization by ID
const destroy = async (id) => {
    await Organization.findByIdAndRemove(id)
    return true
}

module.exports = {
    create,
    getAll,
    getOne,
    getOneByName,
    update,
    destroy
}