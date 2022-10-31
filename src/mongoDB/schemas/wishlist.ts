//defining the schema for wishlist items
const mongoose = require("mongoose")
const WishListSchema = new mongoose.Schema({    //creating instance of mongoose.schema class and defining the schema inside it
    Wish : {
        name: String,
        required: true
    }
})

const Wishlist = new mongoose.model('Wishlist', WishListSchema);
module.exports = Wishlist

