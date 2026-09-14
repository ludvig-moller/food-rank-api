import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { type Database } from "better-sqlite3";
import { type Express } from "express";
import createApp from "../../src/app";
import createDb from "../../src/config/db";

const selectDishes = "SELECT * FROM dishes";
const insertDish = "INSERT INTO dishes (id, restaurant_id, dish_name, description, price) VALUES (?, ?, ?, ?, ?)";

const insertRestaurant = "INSERT INTO restaurants (id, restaurant_name, description, country, city) VALUES (?, ?, ?, ?, ?)";

let testDb: Database;
let app: Express;

beforeEach(() => {
    testDb = createDb(":memory:");
    app = createApp(testDb);
});

afterEach(() => {
    testDb.close();
});

describe("GET /api/dishes", () => {
    it("returns 200 and the dishes", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertDish).run("2", "1", "Capricciosa", "Prosciutto cotto, champignons, black olives", "130kr");

        const res = await request(app)
            .get("/api/dishes");
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    it("returns 200 with an empty array when there are no dishes", async () => {
        const res = await request(app)
            .get("/api/dishes");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("accepts query parameters", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertDish).run("2", "1", "Capricciosa", "Prosciutto cotto, champignons, black olives", "130kr");

        const response = await request(app)
            .get("/api/dishes?page=1&limit=1&sort=dish_name&order=asc&restaurant_id=1");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    it("returns 400 for invalid query parameters", async () => {
        const response = await request(app)
            .get("/api/dishes?page=abc");

        expect(response.status).toBe(400);
    });
});

describe("GET /api/dishes/:id", () => {
    it("returns 200 with the dish", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");

        const res = await request(app)
            .get("/api/dishes/1");

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            id: "1",
            restaurant_id: "1",
            dish_name: "Margherita",
            description: "Tomato sauce, mozzarella, basil",
            price: "120kr",
        });
    });

    it("returns 404 when dish does not exist", async () => {
        const res = await request(app)
            .get("/api/dishes/1");
        
        expect(res.status).toBe(404);
    });
});

describe("POST /api/dishes", () => {
    it("returns 201", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");

        const res = await request(app)
            .post("/api/dishes")
            .send({
                restaurant_id: "1",
                dish_name: "Margherita",
                description: "Tomato sauce, mozzarella, basil",
                price: "120kr",
            });
        
        expect(res.status).toBe(201);
    });

    it("returns created dish", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");

        const res = await request(app)
            .post("/api/dishes")
            .send({
                restaurant_id: "1",
                dish_name: "Margherita",
                description: "Tomato sauce, mozzarella, basil",
                price: "120kr",
            });
        
        expect(res.body).toMatchObject({
            restaurant_id: "1",
            dish_name: "Margherita",
            description: "Tomato sauce, mozzarella, basil",
            price: "120kr",
        });
    });

    it("creates dish in the database", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");

        await request(app)
            .post("/api/dishes")
            .send({
                restaurant_id: "1",
                dish_name: "Margherita",
                description: "Tomato sauce, mozzarella, basil",
                price: "120kr",
            });
        
        const dishes = testDb.prepare(selectDishes).all();

        expect(dishes).toHaveLength(1);
        expect(dishes[0]).toMatchObject({
            restaurant_id: "1",
            dish_name: "Margherita",
            description: "Tomato sauce, mozzarella, basil",
            price: "120kr",
        });
    });

    it("returns 400 when request has missing fields", async () => {
        const res = await request(app)
            .post("/api/dishes")
            .send({
                price: "120kr",
            });
        
        expect(res.status).toBe(400);
    });

    it("returns 404 when restaurant does not exist", async () => {
        const res = await request(app)
            .post("/api/dishes")
            .send({
                restaurant_id: "1",
                dish_name: "Margherita",
                description: "Tomato sauce, mozzarella, basil",
                price: "120kr",
            });
        
        expect(res.status).toBe(404);
    });
});

describe("DELETE /api/dishes/:id", () => {
    it("returns 204", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");

        const res = await request(app)
            .delete("/api/dishes/1");
        
        expect(res.status).toBe(204);
    });

    it("deletes the dish from the database", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");

        await request(app)
            .delete("/api/dishes/1");
        
        const dishes = testDb.prepare(selectDishes).all();

        expect(dishes).toHaveLength(0);
    });

    it("returns 404 when dish does not exist", async () => {
        const res = await request(app)
            .delete("/api/dishes/1");

        expect(res.status).toBe(404);
    });
});
