import express, { type Express } from "express";
import Database from "better-sqlite3";

function createApp(db: Database.Database) {
    const app: Express = express();

    return app;
}

export default createApp;
