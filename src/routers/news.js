const express = require('express')
const auth = require('../middelware/auth')
const News = require('../models/news')
const router = express.Router()
const multer = require('multer')
// CRUD OPERATIONS
router.post('/add', auth, async (req, res) => {
    try {
        const news = new News({ ...req.body, reporter: req.user._id })
        if (!news) {
            return res.send('please add news')
        }
        await news.save()
        res.send(news)
    }
    catch (e) {
        res.send(e.message)
    }
})
router.get('/news', auth, async (req, res) => {
    try {
        const news = await News.find({})
        if (!news) {
            return res.send('no news founded')
        }
        res.send(news)
    }
    catch (e) {
        res.send(e.message)
    }
})
router.patch('/news/:id', auth, async (req, res) => {
    try {
        const _id = req.params._id
        const news = await News.findOneAndUpdate({ _id, reporter: req.user._id }, req.body, {
            new: true,
            runValidators: true
        })
        if (!news) {
            return res.send('no news founded')
        }

        res.send(news)
    }
    catch (e) {
        res.send(e.message)
    }
})
router.delete('/news/:id', auth, async (req, res) => {
    try {
        const _id = req.params._id
        const reporter = req.user._id
        const news = await News.findOneAndDelete(_id)
        if (!news) {
            return res.send('no news founded')
        }

        res.send('Done delete')

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
router.post('/addimg', auth, upload.single('avatar'), async (req, res) => {
    try {
        const news = new News({ ...req.body, img: req.file.buffer, reporter: req.user._id })
        await news.save()
        res.send()
    }
    catch (e) {
        res.send(e.message)
    }
})
router.get('/news-U/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const news = await News.findOne({ _id, reporter: req.user._id })
        if (!news) {
            return res.send('No user found')
        }
        await news.populate('reporter')
        res.send(news.reporter)

    }
    catch (e) {
        res.send(e.message)
    }
})
module.exports = router