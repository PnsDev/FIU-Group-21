import comments from "../mongoDB/schemas/comments";
import {validateObjectValues} from "../utils/classUtils";

export default class Comment {
    userName: string;
    text: string;
    ISBN: string;

    static readonly fields: Map<string, string> = new Map([
        ['userName', 'string'],
        ['text', 'string'],
        ['ISBN', 'string'],
    ]);

    private constructor(userName: string, text: string, ISBN: string) {
        this.userName = userName;
        this.text = text;
        this.ISBN = ISBN;
    }

    /**
     * Create comment with a valid provided Object
     */
    public static fromJSON(JSONComment: any) : Comment | null {
        if (!validateObjectValues(JSONComment, this.fields)) return null;

        return new Comment(JSONComment['userName'], JSONComment['text'], JSONComment['ISBN']);
    }

    /**
     * Gets the comments from the database by ISBN
     */
    public static async getCommentsbyISBN(ISBN: string) : Promise<Comment[] | null> {
        const comment : Comment = new Comment("", "", ISBN);
        const commentsInDB = await comment.findManyInDB();

        if (commentsInDB === null) return null;
        console.log(commentsInDB);

        return commentsInDB;
    } 

    /**
     * Saves the comment to the database
     * @returns true if successful, false if not
     * @throws Error if the comment already exists in the database
     * @throws Error if the comment is invalid
     */
    public async save() : Promise<boolean> { 
        const comment = new comments();
        // Update the comment
        comment.userName = this.userName;
        comment.text = this.text;
        comment.ISBN = this.ISBN;
        
        // Save the comment
        try {
            await comment.save(); 
            return true;
        } catch (ex) {
            return false;
        }
    }

    /**
     * Finds the ratings in the database
     * @returns the rating if it exists in the database, null if not
     */
    private async findManyInDB() : Promise<any> {
        return new Promise((resolve) => {
            comments.find({ISBN: this.ISBN}, (err: any, comment: any) => {
                if (err) resolve(null);
                return resolve(comment);
            });
        });
    }
}
