import Database from "better-sqlite3";

function createDb(filename: string) {
    const db = Database(filename);

    return db;
}

export default createDb;
