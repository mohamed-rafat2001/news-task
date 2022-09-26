const express = require('express')
const auth = require('../middelware/auth')
const multer = require('multer')
const router = express.Router()
const Client = require('../models/reporter')
// ////// CRUD OPERATION
router.post('/signUp', async (req, res) => {
    try {
        const newClient = new Client(req.body)
        await newClient.save()
        const token = newClient.generatetoken()
        res.send({ newClient, token })
    }
    catch (e) {
        res.send(e.message)
    }
})
router.get('/profile', auth, (req, res) => res.send(req.user))
router.get('/clients', auth, async (req, res) => {
    try {
        const clients = await Client.find({})
        res.send(clients)
    }
    catch (e) {
        res.send(e.message)
    }
})

router.patch('/profile', auth, async (req, res) => {
    try {

        const clientUPdate = await Client.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
        if (!clientUPdate) {
            return res.send('No Id Found, please enter right id ')
        }
        res.send(clientUPdate)
    }
    catch (e) {
        res.send(e.message)
    }
})
router.post('/profile', auth, async (req, res) => {
    try {
        const clientDlt = await Client.findByIdAndDelete(req.user._id)
        if (!clientDlt) {
            return res.send('No Id Found, please enter right id ')
        }
        res.send('the client remove')
    }
    catch (e) {
        res.send(e.message)
    }
})
router.post('/login', async (req, res) => {
    try {
        const login = await Client.clientLogin(req.body.email, req.body.password)
        if (!login) {

            return res.send('wrong password or email')
        }
        const token = login.generatetoken()
        res.send({ login, token })
    }
    catch (e) {
        res.send(e.message)
    }
})
const upload = multer({
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
            return cp(new Error('please upload image'))
        }
        cb(null, true)
    }
})
router.post('/profileImg', auth, upload.single('avatar'), async (req, res) => {
    try {
        req.user.img = req.file.buffer
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.send(e.message)
    }
})

module.exports = router