import { type Database } from "better-sqlite3";

import { Restaurant } from "../models/Restaurant";
import { RestaurantQueryDto } from "../schemas/restaurantQuerySchema";
import { NotImplementedError } from "../errors/NotImplementedError";

export class RestaurantRepository {
    private readonly db: Database;

    constructor(db: Database) { 
        this.db = db;
    }

    get(query: RestaurantQueryDto): Restaurant[] {
        const params: (string | number)[] = [];

        const whereConditions: string[] = [];
        if (query.country) {
            whereConditions.push(`country = ?`);
            params.push(query.country);
        }
        if (query.city){
            whereConditions.push(`city = ?`);
            params.push(query.city);
        }

        const offset = (query.page - 1) * query.limit;

        params.push(query.limit, offset);

        const whereClause = whereConditions.length > 0
            ? `WHERE ${whereConditions.join(" AND ")}` : "";

        const order = query.order == "asc" ? "ASC" : "DESC";

        const sql = `
            SELECT * 
            FROM restaurants
            ${whereClause}
            ORDER BY ${query.sort} ${order}
            LIMIT ?
            OFFSET ?
        `;
        
        return this.db
            .prepare(sql)
            .all(...params) as Restaurant[];
    }

    getById(id: string): Restaurant | undefined {
        return this.db
            .prepare("SELECT * FROM restaurants WHERE id = ?")
            .get(id) as Restaurant | undefined;
    }

    create(
        restaurant_name: string,
        description: string | null,
        country: string,
        city: string,
    ): Restaurant {
        throw new NotImplementedError("This is not implemented");
    }
}
