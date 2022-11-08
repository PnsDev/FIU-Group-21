import ratings from "../mongoDB/schemas/ratings";
import {validateObjectValues} from "../utils/classUtils";

export default class Rating {
    userName: string;
    rate: number;
    review: string;
    ISBN: string; 

    static readonly fields: Map<string, string> = new Map([
        ['userName', 'string'],
        ['rate', 'number'],
        ['review', 'string'],
        ['ISBN', 'string'],
    ]);

    private constructor(userName: string, rate: number, review: string, ISBN: string) {
        this.userName = userName;
        this.rate = rate;
        this.review = review;
        this.ISBN = ISBN;
    }

    /**
     * Create rating with a valid provided Object
     */
    public static fromJSON(JSONRating: any) : Rating | null {
        if (!validateObjectValues(JSONRating, this.fields)) return null;
        if(JSONRating['rate'] < 0 || JSONRating['rate'] > 5) return null;

        return new Rating(JSONRating['userName'], JSONRating['rate'], JSONRating['review'],  JSONRating['ISBN']);
    }

    /**
     * Gets a rating from the database by username
     */
     public static async getRatingByUser(userName: string) : Promise<Rating | null> { //TODO: maybe clean this up
        const rating : Rating = new Rating(userName, 0, "", "");
        const ratingInDB = await rating.findInDB();

        if (ratingInDB === null) return null;
        return new Rating(ratingInDB.userName, ratingInDB.rate, ratingInDB.review, ratingInDB.ISBN);
    }

    /**
     * Gets the average rating from the database by ISBN
     */
    public static async getAverage(ISBN: string) : Promise<Rating | null> {
        const rating : Rating = new Rating("", 0, "",ISBN);
        const ratingInDB = await rating.findManyInDB();

        if (ratingInDB === null) return null;

        let totalRating = 0;
        for(let item of ratingInDB) {
            totalRating += item.rate;
        }

        return new Rating("",  totalRating / ratingInDB.length, ratingInDB.review, ratingInDB.ISBN);
    } 

    /**
     * Gets the sorted ranking list from the database
     */
    public static async getSorted(): Promise<Rating[] | null> {
        const rating : Rating = new Rating("", 0, "", "");
        const ratingInDB = await rating.findSortedInDB();

        if (ratingInDB === null) return null;

        return ratingInDB;
    }

    /**
     * Saves the rating to the database
     * @returns true if successful, false if not
     * @throws Error if the rating already exists in the database
     * @throws Error if the rating is invalid
     */
    public async save() : Promise<boolean> { //TODO: add TS types
        let rating = await this.findInDB();
        if (rating === null) rating = new ratings();

        // Update the rating
        rating.userName = this.userName;
        rating.rate = this.rate;
        rating.review = this.review;
        rating.ISBN = this.ISBN;
        
        // Save the rating
        try {
            await rating.save(); //todo error handling through callback
            return true;
        } catch (ex) {
            return false;
        }
    }

    /**
     * Finds the rating in the database
     * @returns the rating if it exists in the database, null if not
     */
    private async findInDB() : Promise<any> {
        return new Promise((resolve) => {
            ratings.findOne({userName: this.userName}, (err: any, rating: any) => {
                if (err) resolve(null);
                return resolve(rating);
            });
        });
    }

    /**
     * Finds the ratings in the database
     * @returns the rating if it exists in the database, null if not
     */
    private async findManyInDB() : Promise<any> {
        return new Promise((resolve) => {
            ratings.find({ISBN: this.ISBN}, (err: any, rating: any) => {
                if (err) resolve(null);
                return resolve(rating);
            });
        });
    }

    /**
     * Finds and sort all rating in the database
     * @returns the rating if it exists in the database, null if not
     */
    private async findSortedInDB() : Promise<any> {
        return new Promise((resolve) => {
            ratings.find({}, (err: any, rating: any) => {
                if (err) resolve(null);
                return resolve(rating);
            }).sort({rate: -1});
        });
    }
}
