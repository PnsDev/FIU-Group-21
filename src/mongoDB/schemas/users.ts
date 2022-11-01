import mongoose from "mongoose";
import wishlist from "./wishlist";

const userProfile = new mongoose.Schema({ 
    username: String,
    password: String,
    name: String,
    email: String,
    address: String, 
    token: String,
    admin: Boolean,
    wishlists: [wishlist]
});

export default mongoose.model("user", userProfile);