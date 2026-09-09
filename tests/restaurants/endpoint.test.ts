import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { type Database } from "better-sqlite3";
import { type Express } from "express";
import createApp from "../../src/app";
import createDb from "../../src/config/db";

const selectRestaurants = "SELECT * FROM restaurants";
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

describe("GET /api/restaurants/:id", () => {
    it("returns 200 with the restaurant", async () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");

        const res = await request(app)
            .get("/api/restaurants/1");

        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({
            id: "1",
            restaurant_name: "Pizza place",
            description: "The best pizza.",
            country: "Sweden",
            city: "Stockholm",
        });
    });

    it("returns 404 when restaurant dose not exist", async () => {
        const res = await request(app)
            .get("/api/restaurants/1");
        
        expect(res.status).toBe(404);
    });
});

describe("POST /api/restaurants", () => {
    it("returns 201", async () => {
        const res = await request(app)
            .post("/api/restaurants")
            .send({
                restaurant_name: "Pizza Place",
                description: "The best pizza.",
                country: "Sweden",
                city: "Stockholm",
            });
        
        expect(res.status).toBe(201);
    });

    it("returns created restaurant", async () => {
        const res = await request(app)
            .post("/api/restaurants")
            .send({
                restaurant_name: "Pizza Place",
                description: "The best pizza.",
                country: "Sweden",
                city: "Stockholm",
            });
        
        expect(res.body).toMatchObject({
            restaurant_name: "Pizza Place",
            description: "The best pizza.",
            country: "Sweden",
            city: "Stockholm",
        });
    });

    it("creates restaurant in the database", async () => {
        await request(app)
            .post("/api/restaurants")
            .send({
                restaurant_name: "Pizza Place",
                description: "The best pizza.",
                country: "Sweden",
                city: "Stockholm",
            });
        
        const restaurants = testDb.prepare(selectRestaurants).all();

        expect(restaurants).toHaveLength(1);
        expect(restaurants[0]).toMatchObject({
            restaurant_name: "Pizza Place",
            description: "The best pizza.",
            country: "Sweden",
            city: "Stockholm",
        });
    });

    it("returns 400 when request has missing fields", async () => {
        const res = await request(app)
            .post("/api/restaurants")
            .send({
                city: "Stockholm",
            });
        
        expect(res.status).toBe(400);
    });
});
