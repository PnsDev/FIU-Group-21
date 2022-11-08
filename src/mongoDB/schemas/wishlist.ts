import { Schema } from "mongoose"

export default new Schema({  
    name: String,
    books: [{
        ISBN: String,
        dateAdded: Date
    }],
})

export type Wishlist = {
    name: string,
    books: {
        ISBN: string,
        dateAdded: Date
    }[]
}