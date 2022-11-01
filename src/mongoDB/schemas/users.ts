import mongoose from "mongoose";
const {Schema} = mongoose;

const userProfile = new Schema({
    username: String,
    password: String,
    name: String,
    email: String,
    address: String, 
    token: String,
    admin: Boolean
});

export default mongoose.model("user", userProfile);