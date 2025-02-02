const { default: mongoose } = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/scratch")

const productSchema = mongoose.Schema(
    {
       image: String,
       name:String,
       price: Number,
       discount: {
        type: Number,
        default: 0
       },
       bgcolor: String,
       panelColor: String,
       textColor: String
    }
)

module.exports =  mongoose.model("product", productSchema)