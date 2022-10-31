import users from "../mongoDB/schemas/users";

export default class User {
    
    username: string;
    password: string;
    name: string;
    email: string;
    address: string; 

    private constructor(username: string, password: string, name: string, email: string, address: string) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.email = email;
        this.address = address;
    }
}
