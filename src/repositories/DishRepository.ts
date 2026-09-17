import { type Database } from "better-sqlite3";

import { Dish } from "../schemas/dishes/dishSchema";
import { DishQueryDto } from "../schemas/dishes/DTOs/dishQuerySchema";
import { DishCreateDto } from "../schemas/dishes/DTOs/dishCreateSchema";
import { DishUpdateDto } from "../schemas/dishes/DTOs/dishUpdateSchema";

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

    getById(id: string): Dish | undefined {
        return this.db
            .prepare("SELECT * FROM dishes WHERE id = ?")
            .get(id) as Dish | undefined;
    }

    create(data: DishCreateDto): Dish {
        return this.db
            .prepare(`
                INSERT INTO 
                dishes (id, restaurant_id, dish_name, description, price)
                VALUES (?, ?, ?, ?, ?)
                RETURNING *
            `)
            .get(
                crypto.randomUUID(), 
                data.restaurant_id, 
                data.dish_name, 
                data.description, 
                data.price,
            ) as Dish;
    }

    update(id: string, data: DishUpdateDto): Dish | undefined {
        const updateFields: string[] = [];
        const updateValues: (string | null)[] = [];

        Object.entries(data).forEach((entry) => {
            updateFields.push(entry[0]);
            updateValues.push(entry[1]);
        });

        const sql = `
            UPDATE dishes 
            SET ${updateFields.map((field) => `${field} = ?`).join(", ")}
            WHERE id = ?
            RETURNING *
        `;

        return this.db
            .prepare(sql)
            .get(...updateValues, id) as Dish | undefined;
    }

    delete(id: string) {
        const result = this.db
            .prepare("DELETE FROM dishes WHERE id = ?")
            .run(id);

        return result.changes > 0;
    }
}
