import mongoose from "mongoose";
import WishlistItem from "./wishListItem";

const userProfile = new mongoose.Schema({ 
    username: String,
    password: String,
    name: String,
    email: String,
    address: String, 
    token: String,
    admin: Boolean,
    wishlist: [WishlistItem]
});

export default mongoose.model("user", userProfile);