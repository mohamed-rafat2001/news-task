const jwt = require('jsonwebtoken')
const reporter = require('../models/reporter')
const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'secretkey')
        const user = await reporter.findById({ _id: decode._id })
        req.user = user
        next()
    }
    catch (e) {
        res.send(e.message)
    }

}
module.exports = auth