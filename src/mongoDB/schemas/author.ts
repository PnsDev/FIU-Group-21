import mongoose from 'mongoose';
const { Schema } = mongoose;

const bookSchema = new Schema({
    name: {
        first: String,
        last: String
    },
    biography: String,
    publisher: String
});


export default mongoose.model("book", bookSchema);