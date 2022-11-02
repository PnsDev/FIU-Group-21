import { randomUUID } from "crypto";
import users from "../mongoDB/schemas/users";
import { Wishlist } from "../mongoDB/schemas/wishlist";
import Book from "./book";

export default class User {
    username: string;
    password: string;
    name: string;
    email: string;
    address: string;
    admin: boolean = false;
    token: string = randomUUID();
    wishlists: Wishlist[] = [];

    /**
     * The following are all constructors for the User class
     */

    private constructor(username: string, password: string, name: string, email: string, address: string, token?: string, admin?: boolean, wishlist?: any[]) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.address = address;
        if (token !== undefined) this.token = token;
        if (admin !== undefined) this.admin = admin;
        if (wishlist !== undefined) this.wishlists = wishlist;
    }

    static async fromUserAndPass(username: string, password: string) : Promise<User | null> {
        return new Promise((resolve) => {
            users.findOne({
                username: username,
                password: password,
            }, (err: any, user: any) => {
                if (err || user === null) return resolve(null);
                resolve(new User(user.username, user.password, user.name, user.email, user.address, user.token, user.admin, user.wishlist));
            });
        });
    }


    static async fromToken(token: string) : Promise<User | null> {
        return new Promise((resolve) => {
            users.findOne({
                token: token,
            }, (err: any, user: any) => {
                if (err || user === null) return; resolve(null);
                resolve(new User(user.username, user.password, user.name, user.email, user.address, user.token, user.admin, user.wishlist));
            });
        });
    }
                


    /**
     * This is all for the wishlist here
     */

    async addBookToList(book: Book, name: string) : Promise<boolean> {
        // find list withing user and then add it to that one
        if (await this.save()) return true;
        return false;
    }

    async removeBookFromList(book: Book, name: string) : Promise<boolean> {



        // todo: same but oposite as above - for jeremy
        return true; // return true if successful and false if not
    }

    async getWishlist(name: string, getBooks?: boolean) : Promise<Book[] | boolean | null> {
        let res = [];
        for (let i = 0; i < this.wishlists.length; i++) {

            const wishlist: Wishlist = this.wishlists[i];
            if (wishlist.name !== name) continue;
            if (getBooks !== undefined && getBooks === false) return true;
            for (let j = 0; j < wishlist.books.length; j++) {
                const book = await Book.getBookByISBN(wishlist.books[j].ISBN);
                if (book !== null) res.push(book);
            }
            return res;
            // todo: maybe you can to remove the book from the wishlist if it doesn't exist anymore - for jeremy
        }
        return getBooks === undefined ? false : null;
    }


    async generateNewToken() : Promise<string | null> {
        this.token = randomUUID();
        if (await this.save()) return this.token;
        return null;
    }

    public async save() : Promise<boolean> { //TODO: add TS types
        let user = await this.findInDB();
        if (user === null) user = new users();

        // Update the user with new data
        user.username = this.username;
        user.password = this.password;
        user.name = this.name;
        user.email = this.email;
        user.address = this.address;
        user.token = this.token;
        user.admin = this.admin;
        user.wishlists = this.wishlists;
        
        // Save the book
        try {
            await user.save(); //todo error handling through callback
            return true;
        } catch (ex) {
            return false;
        }
    }

    public async delete() : Promise<boolean> {
        const user = await this.findInDB();
        if (user === null) return false;

        try {
            await user.delete();
            return true;
        } catch (ex) {
            return false;
        }
    }

    public async inDatabase() : Promise<boolean> {
        let user = await this.findInDB();
        return user !== null;
    }

    private async findInDB() : Promise<any> {
        return new Promise((resolve) => {
            users.findOne({username: this.username}, (err: any, user: any) => {
                if (err) resolve(null);
                return resolve(user);
            });
        });
    }

}
