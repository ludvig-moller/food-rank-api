import { type Database } from "better-sqlite3";

import { Restaurant } from "../schemas/restaurants/restaurantSchema";
import { RestaurantQueryDto } from "../schemas/restaurants/DTOs/restaurantQuerySchema";
import { RestaurantCreateDto } from "../schemas/restaurants/DTOs/restaurantCreateSchema";
import { RestaurantUpdateDto } from "../schemas/restaurants/DTOs/restaurantUpdateSchema";

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

    update(id: string, data: RestaurantUpdateDto): Restaurant | undefined {
        const updateFields: string[] = [];
        const updateValues: (string | null)[] = [];

        Object.entries(data).forEach((entry) => {
            updateFields.push(entry[0]);
            updateValues.push(entry[1]);
        });

        const sql = `
            UPDATE restaurants 
            SET ${updateFields.map((field) => `${field} = ?`).join(", ")}
            WHERE id = ?
            RETURNING *
        `;

        return this.db
            .prepare(sql)
            .get(...updateValues, id) as Restaurant | undefined;
    }

    delete(id: string): boolean {
        const result = this.db
            .prepare("DELETE FROM restaurants WHERE id = ?")
            .run(id);

        return result.changes > 0;
    }
}
