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
        const params: (string | number)[] = [];
        
        let whereClause = "";
        if (query.dish_id) {
            whereClause = "WHERE dish_id = ?";
            params.push(query.dish_id);
        }

        const offset = (query.page - 1) * query.limit;
        params.push(query.limit, offset);

        const order = query.order == "asc" ? "ASC" : "DESC";

        const sql = `
            SELECT * 
            FROM reviews
            ${whereClause}
            ORDER BY ${query.sort} ${order}
            LIMIT ?
            OFFSET ?
        `;
        
        return this.db
            .prepare(sql)
            .all(...params) as Review[];
    }

    getById(id: string): Review | undefined {
        throw new NotImplementedError("This has not been implemented");
    }
}
