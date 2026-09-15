import { type Database } from "better-sqlite3";

import { NotImplementedError } from "../errors/NotImplementedError";
import { Review } from "../models/Review";
import { ReviewQueryDto } from "../schemas/reviews/reviewQuerySchema";

export class ReviewRepository {
    private readonly db: Database;

    constructor(db: Database) { 
        this.db = db;
    }

    get(query: ReviewQueryDto): Review[] {
        throw new NotImplementedError("This has not been implemented");
    }
}
