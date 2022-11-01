import mongoose from 'mongoose';
const { Schema } = mongoose;

const ratingSchema = new Schema({
    userName: String,
    rate: Number,
    review: String,
    ISBN: String, 
},{ timestamps: true });


export default mongoose.model("rating", ratingSchema);
