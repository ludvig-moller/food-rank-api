import { type Database } from "better-sqlite3";

import { Dish } from "../models/Dish";
import { DishQueryDto } from "../schemas/dishes/dishQuerySchema";

export class DishRepository {
    private readonly db: Database;

    constructor(db: Database) { 
        this.db = db;
    }

    get(query: DishQueryDto): Dish[] {
        const params: (string | number)[] = [];

        let whereClause = "";
        if (query.restaurant_id) {
            whereClause = "WHERE restaurant_id = ?";
            params.push(query.restaurant_id);
        }

        const offset = (query.page - 1) * query.limit;
        params.push(query.limit, offset);

        const order = query.order == "asc" ? "ASC" : "DESC";

        const sql = `
            SELECT * 
            FROM dishes
            ${whereClause}
            ORDER BY ${query.sort} ${order}
            LIMIT ?
            OFFSET ?
        `;
        
        return this.db
            .prepare(sql)
            .all(...params) as Dish[];
    }
}
