import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { type Database } from "better-sqlite3";
import createDb from "../../src/config/db";
import { DishRepository } from "../../src/repositories/DishRepository";
import { DishQueryDto } from "../../src/schemas/dishes/dishQuerySchema";
import { DishCreateDto } from "../../src/schemas/dishes/dishCreateSchema";
import { Dish } from "../../src/models/Dish";
import { DishUpdateDto } from "../../src/schemas/dishes/dishUpdateSchema";

const selectDishes = "SELECT * FROM dishes";
const insertDish = "INSERT INTO dishes (id, restaurant_id, dish_name, description, price) VALUES (?, ?, ?, ?, ?)";

const insertRestaurant = "INSERT INTO restaurants (id, restaurant_name, description, country, city) VALUES (?, ?, ?, ?, ?)";

let testDb: Database;

beforeEach(() => {
    testDb = createDb(":memory:");
});

afterEach(() => {
    testDb.close();
});

describe("get", () => {
    it("returns dishes with default query", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertDish).run("2", "1", "Capricciosa", "Prosciutto cotto, champignons, black olives", "130kr");

        const repository = new DishRepository(testDb);

        const query: DishQueryDto = {
            page: 1,
            limit: 20,
            sort: "created_at",
            order: "desc",
        };

        const dishes = repository.get(query);

        expect(dishes).toHaveLength(2);
    });

    it("returns an empty array", () => {
        const repository = new DishRepository(testDb);

        const query: DishQueryDto = {
            page: 1,
            limit: 20,
            sort: "created_at",
            order: "desc",
        };

        const dishes = repository.get(query);

        expect(dishes).toHaveLength(0);
    });

    it("respects the limit", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertDish).run("2", "1", "Capricciosa", "Prosciutto cotto, champignons, black olives", "130kr");

        const repository = new DishRepository(testDb);

        const query: DishQueryDto = {
            page: 1,
            limit: 1,
            sort: "created_at",
            order: "desc",
        };

        const dishes = repository.get(query);

        expect(dishes).toHaveLength(1);
    });

    it("respects pagination", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertDish).run("2", "1", "Capricciosa", "Prosciutto cotto, champignons, black olives", "130kr");

        const repository = new DishRepository(testDb);

        const query: DishQueryDto = {
            page: 2,
            limit: 1,
            sort: "created_at",
            order: "desc",
        };

        const dishes = repository.get(query);

        expect(dishes).toHaveLength(1);
    });

    it("sorts ascending", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertDish).run("2", "1", "Capricciosa", "Prosciutto cotto, champignons, black olives", "130kr");

        const repository = new DishRepository(testDb);

        const query: DishQueryDto = {
            page: 1,
            limit: 20,
            sort: "dish_name",
            order: "asc",
        };

        const dishes = repository.get(query);

        expect(dishes).toHaveLength(2);
        expect(dishes[0].dish_name).toBe("Capricciosa");
        expect(dishes[1].dish_name).toBe("Margherita");
    });

    it("sorts descending", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertDish).run("2", "1", "Capricciosa", "Prosciutto cotto, champignons, black olives", "130kr");

        const repository = new DishRepository(testDb);

        const query: DishQueryDto = {
            page: 1,
            limit: 20,
            sort: "dish_name",
            order: "desc",
        };

        const dishes = repository.get(query);

        expect(dishes).toHaveLength(2);
        expect(dishes[0].dish_name).toBe("Margherita");
        expect(dishes[1].dish_name).toBe("Capricciosa");
    });

    it("filters by restaurant_id", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");

        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("2", "2", "Cheese Burger", "Lettuce and cheese", "120kr");

        const repository = new DishRepository(testDb);

        const query: DishQueryDto = {
            page: 1,
            limit: 20,
            sort: "created_at",
            order: "desc",
            restaurant_id: "1",
        };

        const dishes = repository.get(query);

        expect(dishes).toHaveLength(1);
        expect(dishes[0].dish_name).toBe("Margherita");
    });

    it("combines pagination, sorting and filtering", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertDish).run("2", "1", "Capricciosa", "Prosciutto cotto, champignons, black olives", "130kr");

        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("3", "2", "Cheese Burger", "Lettuce and cheese", "120kr");

        const repository = new DishRepository(testDb);

        const query: DishQueryDto = {
            page: 2,
            limit: 1,
            sort: "dish_name",
            order: "asc",
            restaurant_id: "1",
        };

        const dishes = repository.get(query);

        expect(dishes).toHaveLength(1);
        expect(dishes[0].dish_name).toBe("Margherita");
    });
});

describe("getById", () => {
    it("returns the dish when it exsits", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");

        const repository = new DishRepository(testDb);

        const dish = repository.getById("1");

        expect(dish).toMatchObject({
            id: "1",
            restaurant_id: "1",
            dish_name: "Margherita",
            description: "Tomato sauce, mozzarella, basil",
            price: "120kr",
        });
    });

    it("returns undefined when it dosent exists", () => {
        const repository = new DishRepository(testDb);

        const dish = repository.getById("1");

        expect(dish).toBeUndefined();
    });
});

describe("create", () => {
    it("inserts a dish with correct fields", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");

        const repository = new DishRepository(testDb);

        const data: DishCreateDto = {
            restaurant_id: "1",
            dish_name: "Margherita",
            description: "Tomato sauce, mozzarella, basil",
            price: "120kr",
        };
        repository.create(data);

        const dishes = testDb.prepare(selectDishes).all() as Dish[];

        expect(dishes).toHaveLength(1);
        expect(dishes[0]).toMatchObject({
            restaurant_id: "1",
            dish_name: "Margherita",
            description: "Tomato sauce, mozzarella, basil",
            price: "120kr",
        });
    });
});

describe("update", () => {
    it("updates the dish correctly", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");

        const repository = new DishRepository(testDb);

        const data: DishUpdateDto = {
            dish_name: "Capricciosa",
            description: null,
            price: "130kr",
        }
        repository.update("1", data);

        const dishes = testDb.prepare(selectDishes).all();

        expect(dishes).toHaveLength(1);
        expect(dishes[0]).toMatchObject({
            dish_name: "Capricciosa",
            description: null,
            price: "130kr",
        });
    });

    it("updates one field correctly", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");

        const repository = new DishRepository(testDb);

        const data: DishUpdateDto = {
            price: "130kr",
        }
        repository.update("1", data);

        const dishes = testDb.prepare(selectDishes).all();

        expect(dishes).toHaveLength(1);
        expect(dishes[0]).toMatchObject({
            dish_name: "Margherita",
            description: "Tomato sauce, mozzarella, basil",
            price: "130kr",
        });
    });
});

describe("delete", () => {
    it("deletes the dish and returns true", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");

        const repository = new DishRepository(testDb);

        const result = repository.delete("1");

        const dishes = testDb.prepare(selectDishes).all();

        expect(dishes).toHaveLength(0);
        expect(result).toBe(true);
    });

    it("returns false when the id dose not exist", () => {
        const repository = new DishRepository(testDb);

        const result = repository.delete("1");

        expect(result).toBe(false);
    });
});
