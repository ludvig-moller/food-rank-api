import { type Database } from "better-sqlite3";

import { Dish } from "../models/Dish";
import { DishQueryDto } from "../schemas/dishes/dishQuerySchema";
import { NotImplementedError } from "../errors/NotImplementedError";

export class DishRepository {
    private readonly db: Database;

    constructor(db: Database) { 
        this.db = db;
    }

    get(query: DishQueryDto): Dish[] {
        throw new NotImplementedError("This has not been implemented");
    }
}
