import Database from "better-sqlite3";

function createDb(filename: string) {
    const db = Database(filename);

    db.exec(`
        CREATE TABLE IF NOT EXISTS restaurants (
            id TEXT PRIMARY KEY,
            restaurant_name VARCHAR(100) NOT NULL,
            description VARCHAR(1000),
            country VARCHAR(100) NOT NULL,
            city VARCHAR(100) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT current_timestamp
        )
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS dishes (
            id TEXT PRIMARY KEY,
            restaurant_id TEXT,
            dish_name VARCHAR(100) NOT NULL,
            description VARCHAR(500),
            price VARCHAR(20) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
            FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
        )
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            dish_id TEXT,
            rating INTEGER NOT NULL,
            description VARCHAR(1000),
            created_at TIMESTAMP NOT NULL DEFAULT current_timestamp,
            FOREIGN KEY (dish_id) REFERENCES dishes(id)
        )
    `);

    return db;
}

export default createDb;
