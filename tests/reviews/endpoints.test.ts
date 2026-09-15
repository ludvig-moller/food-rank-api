import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { type Database } from "better-sqlite3";
import { type Express } from "express";
import createApp from "../../src/app";
import createDb from "../../src/config/db";

const insertReview = "INSERT INTO reviews (id, dish_id, rating, description) VALUES (?, ?, ?, ?)";

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

describe("GET /api/reviews", () => {
    it("returns 200 and the reviews", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertReview).run("1", "1", 5, "Very good");
        testDb.prepare(insertReview).run("2", "1", 1, "Very bad");

        const res = await request(app)
            .get("/api/reviews");
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    it("returns 200 with an empty array when there are no reviews", async () => {
        const res = await request(app)
            .get("/api/reviews");

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it("accepts query parameters", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertReview).run("1", "1", 5, "Very good");
        testDb.prepare(insertReview).run("2", "1", 1, "Very bad");

        const response = await request(app)
            .get("/api/reviews?page=1&limit=1&sort=rating&order=asc&dish_id=1");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
    });

    it("returns 400 for invalid query parameters", async () => {
        const response = await request(app)
            .get("/api/reviews?page=abc");

        expect(response.status).toBe(400);
    });
});