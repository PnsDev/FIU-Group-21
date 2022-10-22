import authors from "../mongoDB/schemas/author";
import {validateObjectValues} from "../utils/classUtils";

export default class Author {
    id: String;
    first: String; // first name
    last: String; // last name
    biography: String;
    publisher: String;

    // Used for validation
    private static fields: Map<string, string> = new Map([
        ['id', 'string'],
        ['first', 'string'],
        ['last', 'string'],
        ['biography', 'string'],
        ['publisher', 'string']
    ]);


    private constructor (id: String, first: String, last: String, biography: String, publisher: String) {
        this.id = id;
        this.first = first;
        this.last = last;
        this.biography = biography;
        this.publisher = publisher;
    }

    /**
     * Create author with a valid provided Object
     */
    public static fromJSON(JSONAuthor: any) : Author | null {
        // loop thru map and make sure all fields were provided
        if (!validateObjectValues(JSONAuthor, this.fields)) return null;

        return new Author(JSONAuthor['id'], JSONAuthor['first'], JSONAuthor['last'], JSONAuthor['biography'], JSONAuthor['publisher']);
    }

    public static async fromID(id: String): Promise<Author | null> {
        let temp = await (new Author(id, 'a', 'a', 'a', 'a')).findInDB();
        if (temp === null) return null;
        return new Author(temp.id, temp.name.first, temp.name.last, temp.biography, temp.publisher);
    }

    /**
     * Saves the author to the database
     * @returns true if successful, false if not
     * @throws Error if the author already exists in the database
     * @throws Error if the author is invalid
     */
    public async save() : Promise<boolean> { //TODO: add TS types
        let author = await this.findInDB();
        if (author === null) author = new authors();

        // Update the author
        author.id = this.id
        author.name.first = this.first;
        author.name.last = this.last;
        author.biography = this.biography;
        author.publisher = this.publisher;
        
        // Save the book
        try {
            await author.save(); //todo error handling through callback
            return true;
        } catch (ex) {
            return false;
        }
    }

    /**
     * Deletes the author from the database
     * @returns A  boolean indicating if the author was deleted
     */
    public async delete() : Promise<boolean> {
        const author = await this.findInDB();
        if (author === null) return false;

        try {
            await author.delete();
            return true;
        } catch (ex) {
            return false;
        }
    }

    // finds dupe in db based off name and stuff like that
    public async isAlreadyInDB() : Promise<boolean> {
        return new Promise((resolve) => {
            authors.findOne({
                name: {
                    first: this.first,
                    last: this.last
                },
                biography: this.biography,
                publisher: this.publisher
            }, (err: any, book: any) => {
                if (err) resolve(false);
                return resolve(book !== null);
            });
        });
    }


    /**
     * Finds the book in the database
     * @returns the book if it exists in the database, null if not
     */
    private async findInDB() : Promise<any> {
        return new Promise((resolve) => {
            authors.findOne({id: this.id}, (err: any, book: any) => {
                if (err) resolve(null);
                return resolve(book);
            });
        });
    }
}