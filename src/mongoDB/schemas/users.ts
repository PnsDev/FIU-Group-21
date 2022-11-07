import mongoose from "mongoose";

const userProfile = new mongoose.Schema({ 
    username: String,
    password: String,
    name: String,
    email: String,
    address: String, 
    token: String,
    admin: Boolean,
});

export default mongoose.model("user", userProfile);