import authors from "../mongoDB/schemas/author";

export default class Author {
    id: String;
    first: String; // first name
    last: String; // last name
    biography: String;
    publisher: String;


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
        // TODO: kinda messy, maybe make a better way to do this
        if (!JSONAuthor.hasOwnProperty('id') || typeof JSONAuthor['id'] !== 'string') return null;
        if (!JSONAuthor.hasOwnProperty('first') || typeof JSONAuthor['first'] !== 'string') return null;
        if (!JSONAuthor.hasOwnProperty('last') || typeof JSONAuthor['last'] !== 'string') return null;
        if (!JSONAuthor.hasOwnProperty('biography') || typeof JSONAuthor['biography'] !== 'string') return null;
        if (!JSONAuthor.hasOwnProperty('publisher') || typeof JSONAuthor['publisher'] !== 'string') return null;

        return new Author(JSONAuthor['id'], JSONAuthor['first'], JSONAuthor['last'], JSONAuthor['biography'], JSONAuthor['publisher']);
    }

    /**
     * Checks if the author exists in the database
     */
    public async inDatabase() : Promise<boolean> {
        let author = await this.findInDB();
        return author !== null;
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
        author.first = this.first;
        author.last = this.last;
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