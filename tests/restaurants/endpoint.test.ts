import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { type Database } from "better-sqlite3";
import { type Express } from "express";
import createApp from "../../src/app";
import createDb from "../../src/config/db";

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

describe("GET /api/restaurants", () => {
    it("returns 200 and the restaurants", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Sweden", "Stockholm");

        const res = await request(app)
            .get("/api/restaurants");
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    it("returns 200 with an empty array when there are no restaurants", async () => {
        const res = await request(app)
            .get("/api/restaurants");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("accepts query parameters", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Sweden", "Stockholm");

        const response = await request(app)
            .get("/api/restaurants?page=1&limit=1&sort=restaurant_name&order=asc&country=Sweden");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    it("returns 400 for invalid query parameters", async () => {
        const response = await request(app)
            .get("/api/restaurants?page=abc");

        expect(response.status).toBe(400);
    });
});
