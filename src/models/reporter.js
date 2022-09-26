const mongoose = require('mongoose')
const Validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        require: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!Validator.isEmail(value)) {
                throw new Error("email is wrong")
            }
        },
    },
    password: {
        type: String,
        trim: true,
        require: true,
        validate(value) {
            if (!Validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
                throw new Error("please enter the alphanumeric password")
            }
        },
    },
    age: {
        type: Number,
        trim: true,

    },
    phone: {
        type: String,
        trim: true,
        validate(value) {
            if (!Validator.isMobilePhone(value, 'ar-EG')) {
                throw new Error("phone not egypt's number")
            }
        }
    },
    img: {
        type: Buffer
    },

})
clientSchema.pre('save', async function () {
    if (this.isModified('password')) {
        this.password = await bcryptjs.hash(this.password, 8)

    }
})

clientSchema.statics.clientLogin = async (email, password) => {
    const user = await Client.findOne({ email })
    if (!user) {
        throw new Error('please enter right password or email')
    }
    const passMatch = await bcryptjs.compare(password, user.password)
    if (passMatch) {
        return user
    }
    throw new Error(' password or email')

}
clientSchema.methods.generatetoken = function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'secretkey')
    return token
}
const Client = mongoose.model('Client', clientSchema)
module.exports = Client