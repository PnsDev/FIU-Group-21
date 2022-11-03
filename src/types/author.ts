import authors from "../mongoDB/schemas/author";
import {validateObjectValues} from "../utils/classUtils";

export default class Author {
    id: String;
    first: String;
    last: String;
    biography: String;
    publisher: String;
    [key: string]: any; // Used for easy updating


    static readonly fields: Map<string, string> = new Map([
        ['id', 'string'],
        ['first', 'string'],
        ['last', 'string'],
        ['biography', 'string'],
        ['publisher', 'string']
    ]);

    /**
     * Creates an author object
     * @param id The ID of the author
     * @param first The first name of the author
     * @param last The last name of the author
     * @param biography The biography of the author
     * @param publisher The publisher of the author
     */
    private constructor(id: String, first: String, last: String, biography: String, publisher: String) {
        this.id = id;
        this.first = first;
        this.last = last;
        this.biography = biography;
        this.publisher = publisher;
    }

    /**
     * Creates an author from a valid JSON object
     * @param JSONAuthor The JSON object to convert to an Author object
     * @returns The Author object if the JSON object is valid, null if not
     */
    public static fromJSON(JSONAuthor: any) : Author | null {
        // loop thru map and make sure all fields were provided
        if (!validateObjectValues(JSONAuthor, this.fields)) return null;
        return new Author(JSONAuthor['id'], JSONAuthor['first'], JSONAuthor['last'], JSONAuthor['biography'], JSONAuthor['publisher']);
    }

    /**
     * Creates an author from a valid ID stored in the database
     * @param ID The ID of the author to find
     * @returns The author if it exists in the database, null if not
     */
    public static async fromID(ID: String): Promise<Author | null> {
        let temp = await (new Author(ID, 'a', 'a', 'a', 'a')).findInDB();
        return (temp == null ? null : new Author(temp.id, temp.name.first, temp.name.last, temp.biography, temp.publisher));
    }

    /**
     * Saves the author to the database
     * @returns A boolean indicating if the book was saved
     */
    public async save() : Promise<boolean> {
        let author = await this.findInDB();
        if (author === null) author = new authors();

        // Update the author schema with the new values
        author.id = this.id
        author.name.first = this.first;
        author.name.last = this.last;
        author.biography = this.biography;
        author.publisher = this.publisher;
        
        try { // Save the author
            await author.save();
        } catch { return false; }
        return true;
    }

    /**
     * Deletes the author from the database
     * @returns A boolean indicating if the author was deleted
     */
    public async delete() : Promise<boolean> {
        const author = await this.findInDB();
        if (author === null) return false;

        try { await author.delete();}
        catch (ex) { return false; }
        return true;
    }

    /**
     * Checks if an identical author (excluding ID) exists in the database
     * @returns A boolean indicating if the author exists in the database
     */
    public async isAuthorAlreadyInDB() : Promise<boolean> {
        return new Promise((resolve) => {
            authors.findOne({
                name: {
                    first: this.first,
                    last: this.last
                },
                biography: this.biography,
                publisher: this.publisher
            }, (err: any, author: any) => {
                if (err) return resolve(false);
                resolve(author !== null);
            });
        });
    }


    /**
     * Finds the author in the database by ID
     * @returns The author if it exists in the database, null if not
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