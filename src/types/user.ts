import { randomUUID } from "crypto";
import users from "../mongoDB/schemas/users";

export default class User {
    username: string;
    password: string;
    name: string;
    email: string;
    address: string;
    admin: boolean = false;
    token: string = randomUUID();

    private constructor(username: string, password: string, name: string, email: string, address: string, token?: string, admin?: boolean) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.address = address;
        if (token !== undefined) this.token = token;
        if (admin !== undefined) this.admin = admin;
    }


    async generateNewToken() : Promise<string> {
        this.token = randomUUID();
        // Save the user here to the database to assure that the token is updated
        return this.token;
    }

}
