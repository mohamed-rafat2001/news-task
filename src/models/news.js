const mongoose = require('mongoose')
const news = mongoose.model('news', {
    title: {
        type: String,
        trim: true,
        require: true,

    },
    description: {
        type: String,
        trim: true
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: 'Client',
    },
    img: { type: Buffer }
})
module.exports = news