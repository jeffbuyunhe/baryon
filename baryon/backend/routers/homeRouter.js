const homeRouter = require('express').Router()

homeRouter.get('/', async (req, res) => {
    res.send('<h1>Welcome to the Baryon API</h1>')
})

module.exports = homeRouter