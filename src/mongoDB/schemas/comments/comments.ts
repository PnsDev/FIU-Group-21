import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
    userName: String,
    text: String,
    ISBN: String,
},{ timestamps: true });


export default mongoose.model("comment", commentSchema);
