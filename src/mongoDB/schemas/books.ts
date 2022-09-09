import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookSchema = new Schema({
    ISBN: String,
    name: String,
    description: String,
    price: Number,
    author: String, // Author ID (Query user endpoint for data)
    genre: [String],
    publisher: String, // Publisher ID (Query publisher endpoint for data)
});


export default mongoose.model("book", bookSchema);