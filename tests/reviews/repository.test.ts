import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { type Database } from "better-sqlite3";
import createDb from "../../src/config/db";
import { ReviewRepository } from "../../src/repositories/ReviewRepository";
import { ReviewQueryDto } from "../../src/schemas/reviews/reviewQuerySchema";

const insertReview = "INSERT INTO reviews (id, dish_id, rating, description) VALUES (?, ?, ?, ?)";

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
    it("returns reviews with default query", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertReview).run("1", "1", 5, "Very good");
        testDb.prepare(insertReview).run("2", "1", 1, "Very bad");

        const repository = new ReviewRepository(testDb);

        const query: ReviewQueryDto = {
            page: 1,
            limit: 20,
            sort: "created_at",
            order: "desc",
        };

        const reviews = repository.get(query);

        expect(reviews).toHaveLength(2);
    });

    it("returns an empty array", () => {
        const repository = new ReviewRepository(testDb);

        const query: ReviewQueryDto = {
            page: 1,
            limit: 20,
            sort: "created_at",
            order: "desc",
        };

        const reviews = repository.get(query);

        expect(reviews).toHaveLength(0);
    });

    it("respects the limit", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertReview).run("1", "1", 5, "Very good");
        testDb.prepare(insertReview).run("2", "1", 1, "Very bad");

        const repository = new ReviewRepository(testDb);

        const query: ReviewQueryDto = {
            page: 1,
            limit: 1,
            sort: "created_at",
            order: "desc",
        };

        const reviews = repository.get(query);

        expect(reviews).toHaveLength(1);
    });

    it("respects pagination", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertReview).run("1", "1", 5, "Very good");
        testDb.prepare(insertReview).run("2", "1", 1, "Very bad");

        const repository = new ReviewRepository(testDb);

        const query: ReviewQueryDto = {
            page: 2,
            limit: 1,
            sort: "created_at",
            order: "desc",
        };

        const reviews = repository.get(query);

        expect(reviews).toHaveLength(1);
    });

    it("sorts ascending", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertReview).run("1", "1", 5, "Very good");
        testDb.prepare(insertReview).run("2", "1", 1, "Very bad");

        const repository = new ReviewRepository(testDb);

        const query: ReviewQueryDto = {
            page: 1,
            limit: 20,
            sort: "rating",
            order: "asc",
        };

        const reviews = repository.get(query);

        expect(reviews).toHaveLength(2);
        expect(reviews[0].description).toBe("Very bad");
        expect(reviews[1].description).toBe("Very good");
    });

    it("sorts descending", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertReview).run("1", "1", 5, "Very good");
        testDb.prepare(insertReview).run("2", "1", 1, "Very bad");

        const repository = new ReviewRepository(testDb);

        const query: ReviewQueryDto = {
            page: 1,
            limit: 20,
            sort: "rating",
            order: "desc",
        };

        const reviews = repository.get(query);

        expect(reviews).toHaveLength(2);
        expect(reviews[0].description).toBe("Very good");
        expect(reviews[1].description).toBe("Very bad");
    });

    it("filters by dish_id", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");

        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertReview).run("1", "1", 5, "Very good");

        testDb.prepare(insertDish).run("2", "1", "Capricciosa", "Prosciutto cotto, champignons, black olives", "130kr");
        testDb.prepare(insertReview).run("2", "2", 1, "Very bad");


        const repository = new ReviewRepository(testDb);

        const query: ReviewQueryDto = {
            page: 1,
            limit: 20,
            sort: "created_at",
            order: "desc",
            dish_id: "1",
        };

        const reviews = repository.get(query);

        expect(reviews).toHaveLength(1);
        expect(reviews[0].description).toBe("Very good");
    });

    it("combines pagination, sorting and filtering", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertDish).run("1", "1", "Margherita", "Tomato sauce, mozzarella, basil", "120kr");
        testDb.prepare(insertReview).run("1", "1", 5, "Very good");
        testDb.prepare(insertReview).run("2", "1", 4, "Good");

        testDb.prepare(insertDish).run("2", "1", "Capricciosa", "Prosciutto cotto, champignons, black olives", "130kr");
        testDb.prepare(insertReview).run("3", "2", 1, "Very bad");

        const repository = new ReviewRepository(testDb);

        const query: ReviewQueryDto = {
            page: 2,
            limit: 1,
            sort: "rating",
            order: "asc",
            dish_id: "1",
        };

        const reviews = repository.get(query);

        expect(reviews).toHaveLength(1);
        expect(reviews[0].description).toBe("Very good");
    });
});
