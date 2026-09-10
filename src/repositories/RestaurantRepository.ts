import { type Database } from "better-sqlite3";

import { Restaurant } from "../models/Restaurant";
import { RestaurantQueryDto } from "../schemas/restaurantQuerySchema";
import { RestaurantCreateDto } from "../schemas/restaurantCreateSchema";
import { RestaurantUpdateDto } from "../schemas/restaurantUpdateSchema";
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

    create(data: RestaurantCreateDto): Restaurant {
        return this.db
            .prepare(`
                INSERT INTO 
                restaurants (id, restaurant_name, description, country, city)
                VALUES (?, ?, ?, ?, ?)
                RETURNING *
            `)
            .get(
                crypto.randomUUID(), 
                data.restaurant_name, 
                data.description, 
                data.country, 
                data.city,
            ) as Restaurant;
    }

    update(data: RestaurantUpdateDto): Restaurant {
        throw new NotImplementedError("This has not been implemented");
    }
}
