import { type Database } from "better-sqlite3";

import { Restaurant } from "../models/Restaurant";
import { RestaurantQuery } from "../types/RestaurantQuery";
import { NotImplementedError } from "../errors/NotImplementedError";

export class RestaurantRepository {
    private readonly db: Database;

    constructor(db: Database) { 
        this.db = db;
    }

    get(query: RestaurantQuery): Restaurant[] {
        throw new NotImplementedError("This is not implemented.");
    }
}
