import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { type Database } from "better-sqlite3";
import { type Express } from "express";
import createApp from "../../src/app";
import createDb from "../../src/config/db";

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
