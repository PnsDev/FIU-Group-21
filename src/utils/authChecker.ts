import users from "../mongoDB/schemas/users";

export default async (token: string | undefined) : Promise<Boolean> => {
    if (token === undefined) return false;
    return new Promise((resolve) => {
        users.findOne({token: token}, (err: any, user: any) => {
            if (err || user === null) return resolve(false);
            return resolve(user.admin === true);
        });
    });
};