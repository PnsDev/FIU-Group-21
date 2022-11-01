import { randomUUID } from "crypto";
import users from "../mongoDB/schemas/users";
import Book from "./book";

export default class User {
    username: string;
    password: string;
    name: string;
    email: string;
    address: string;
    admin: boolean = false;
    token: string = randomUUID();
    wishlist: any[] = [];

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
        if (wishlist !== undefined) this.wishlist = wishlist;
    }

    static async fromUserAndPass(username: string, password: string) : Promise<any> {
        return new Promise((resolve) => {
            users.findOne({
                username: username,
                password: password,
            }, (err: any, book: any) => {
                resolve(true);
                // todo turn into user class
            });
        });
    }



    /**
     * This is all for the wishlist here
     */


    async addBookToList(book: Book) : Promise<boolean> {
        //todo: add logic to add book to wishlist and then save it - for jeremy
        return true; // return true if successful and false if not
    }

    async removeBookFromList(book: Book) : Promise<boolean> {
        // todo: same but oposite as above - for jeremy
        return true; // return true if successful and false if not
    }

    async getWishlist() : Promise<Book[]> {
        let res = [];
        for (let i = 0; i < this.wishlist.length; i++) {
            let book = await Book.getBookByISBN(this.wishlist[i].ISBN);
            if (book !== null) res.push(book);
            // todo: maybe you can to remove the book from the wishlist if it doesn't exist anymore - for jeremy
        }
        return res;
    }


    async generateNewToken() : Promise<string> {
        this.token = randomUUID();
        await this.save();
        return this.token;
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
