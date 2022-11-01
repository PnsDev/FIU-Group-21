import users from "../mongoDB/schemas/users";

export default async (token: string) : Promise<Boolean> => {
    return new Promise((resolve) => {
        users.findOne({token: token}, (err: any, user: any) => {
            if (err || !user) return resolve(false);
            return resolve(user.admin === true);
        });
    });
};