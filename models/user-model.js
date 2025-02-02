const { default: mongoose } = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/scratch")

const userSchema = mongoose.Schema(
    {
        fullName: String,
        email: String,
        password: string,
        cart: {
            type: Array,
            default: []
        },
        isAdmin: Boolean,
        orders: {
            type: Array,
            default: []
        },
        contact: Number,
        picture: db
    }
)

module.exports =  mongoose.model("user", userSchema)