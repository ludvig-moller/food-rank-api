import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { type Database } from "better-sqlite3";
import createDb from "../../src/config/db";
import { RestaurantRepository } from "../../src/repositories/RestaurantRepository";
import { RestaurantQueryDto } from "../../src/schemas/restaurantQuerySchema";
import { RestaurantCreateDto } from "../../src/schemas/restaurantCreateSchema";
import { Restaurant } from "../../src/models/Restaurant";
import { RestaurantUpdateDto } from "../../src/schemas/restaurantUpdateSchema";

const selectRestaurants = "SELECT * FROM restaurants";
const insertRestaurant = "INSERT INTO restaurants (id, restaurant_name, description, country, city) VALUES (?, ?, ?, ?, ?)";

let testDb: Database;

beforeEach(() => {
    testDb = createDb(":memory:");
});

afterEach(() => {
    testDb.close();
});

describe("get", () => {
    it("returns restaurants with default query", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Sweden", "Stockholm");

        const repository = new RestaurantRepository(testDb);

        const query: RestaurantQueryDto = {
            page: 1,
            limit: 20,
            sort: "created_at",
            order: "desc",
        };

        const restaurants = repository.get(query);

        expect(restaurants).toHaveLength(2);
    });

    it("returns an empty array", () => {
        const repository = new RestaurantRepository(testDb);

        const query: RestaurantQueryDto = {
            page: 1,
            limit: 20,
            sort: "created_at",
            order: "desc",
        };

        const restaurants = repository.get(query);

        expect(restaurants).toHaveLength(0);
    });

    it("respects the limit", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Sweden", "Stockholm");

        const repository = new RestaurantRepository(testDb);

        const query: RestaurantQueryDto = {
            page: 1,
            limit: 1,
            sort: "created_at",
            order: "desc",
        };

        const restaurants = repository.get(query);

        expect(restaurants).toHaveLength(1);
    });

    it("respects pagination", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Sweden", "Stockholm");

        const repository = new RestaurantRepository(testDb);

        const query: RestaurantQueryDto = {
            page: 2,
            limit: 1,
            sort: "created_at",
            order: "desc",
        };

        const restaurants = repository.get(query);

        expect(restaurants).toHaveLength(1);
    });

    it("sorts ascending", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Sweden", "Stockholm");

        const repository = new RestaurantRepository(testDb);

        const query: RestaurantQueryDto = {
            page: 1,
            limit: 20,
            sort: "restaurant_name",
            order: "asc",
        };

        const restaurants = repository.get(query);

        expect(restaurants).toHaveLength(2);
        expect(restaurants[0].restaurant_name).toBe("Burger place");
        expect(restaurants[1].restaurant_name).toBe("Pizza place");
    });

    it("sorts descending", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Sweden", "Stockholm");

        const repository = new RestaurantRepository(testDb);

        const query: RestaurantQueryDto = {
            page: 1,
            limit: 20,
            sort: "restaurant_name",
            order: "desc",
        };

        const restaurants = repository.get(query);

        expect(restaurants).toHaveLength(2);
        expect(restaurants[0].restaurant_name).toBe("Pizza place");
        expect(restaurants[1].restaurant_name).toBe("Burger place");
    });

    it("filters by country", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");
        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Germany", "Berlin");

        const repository = new RestaurantRepository(testDb);

        const query: RestaurantQueryDto = {
            page: 1,
            limit: 20,
            sort: "created_at",
            order: "desc",
            country: "Sweden",
        };

        const restaurants = repository.get(query);

        expect(restaurants).toHaveLength(1);
        expect(restaurants[0].restaurant_name).toBe("Pizza place");
    });

    it("filters by city", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Örebro");
        testDb.prepare(insertRestaurant).run("2", "Burger place", "The best burger.", "Sweden", "Stockholm");

        const repository = new RestaurantRepository(testDb);

        const query: RestaurantQueryDto = {
            page: 1,
            limit: 20,
            sort: "created_at",
            order: "desc",
            city: "Örebro",
        };

        const restaurants = repository.get(query);

        expect(restaurants).toHaveLength(1);
        expect(restaurants[0].restaurant_name).toBe("Pizza place");
    });

    it("combines pagination, sorting and filtering", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Örebro");
        testDb.prepare(insertRestaurant).run("2", "Pasta place", "The best pasta.", "Sweden", "Örebro");
        testDb.prepare(insertRestaurant).run("3", "Burger place", "The best burger.", "Sweden", "Stockholm");
        testDb.prepare(insertRestaurant).run("4", "Kebab place", "The best kebab.", "Germany", "Berlin");

        const repository = new RestaurantRepository(testDb);

        const query: RestaurantQueryDto = {
            page: 2,
            limit: 1,
            sort: "restaurant_name",
            order: "asc",
            country: "Sweden",
            city: "Örebro",
        };

        const restaurants = repository.get(query);

        expect(restaurants).toHaveLength(1);
        expect(restaurants[0].restaurant_name).toBe("Pizza place");
    });
});

describe("getById", () => {
    it("returns the resturant when it exsits", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");

        const repository = new RestaurantRepository(testDb);

        const restaurant = repository.getById("1");

        expect(restaurant).toMatchObject({
            id: "1",
            restaurant_name: "Pizza place",
            description: "The best pizza.",
            country: "Sweden",
            city: "Stockholm",
        });
    });

    it("returns undefined when it dosent exists", () => {
        const repository = new RestaurantRepository(testDb);

        const restaurant = repository.getById("1");

        expect(restaurant).toBeUndefined();
    });
});

describe("create", () => {
    it("inserts a restaurant with correct fields", () => {
        const repository = new RestaurantRepository(testDb);

        const data: RestaurantCreateDto = {
            restaurant_name: "Pizza place",
            description: "The best pizza.",
            country: "Sweden",
            city: "Stockholm",
        };
        repository.create(data);

        const restaurants = testDb.prepare(selectRestaurants).all() as Restaurant[];

        expect(restaurants).toHaveLength(1);
        expect(restaurants[0]).toMatchObject({
            restaurant_name: "Pizza place",
            description: "The best pizza.",
            country: "Sweden",
            city: "Stockholm",
        });
    });
});

describe("update", () => {
    it("updates the restaurant correctly", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");

        const repository = new RestaurantRepository(testDb);

        const data: RestaurantUpdateDto = {
            restaurant_name: "Pizza palace", 
            description: null,
            country: "Norway",
            city: "Oslo",
        }
        repository.update("1", data);

        const restaurants = testDb.prepare(selectRestaurants).all();

        expect(restaurants).toHaveLength(1);
        expect(restaurants[0]).toMatchObject({
            restaurant_name: "Pizza palace", 
            description: null,
            country: "Norway",
            city: "Oslo",
        });
    });

    it("updates one field correctly", () => {
        testDb.prepare(insertRestaurant).run("1", "Pizza place", "The best pizza.", "Sweden", "Stockholm");

        const repository = new RestaurantRepository(testDb);

        const data: RestaurantUpdateDto = {
            city: "Örebro",
        }
        repository.update("1", data);

        const restaurants = testDb.prepare(selectRestaurants).all();

        expect(restaurants).toHaveLength(1);
        expect(restaurants[0]).toMatchObject({
            restaurant_name: "Pizza place", 
            description: "The best pizza.",
            country: "Sweden",
            city: "Örebro",
        });
    });
});
