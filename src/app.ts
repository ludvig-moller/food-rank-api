import express, { type Express } from "express";
import Database from "better-sqlite3";
import { createRestaurantRoutes } from "./routes/RestaurantRoutes";
import { RestaurantRepository } from "./repositories/RestaurantRepository";
import { RestaurantService } from "./services/RestaurantService";
import { RestaurantController } from "./controllers/RestaurantController";

function createApp(db: Database.Database) {
    const app: Express = express();

    const restaurantRepository = new RestaurantRepository(db);
    const restaurantService = new RestaurantService(restaurantRepository);
    const restaurantController = new RestaurantController(restaurantService);
    app.use("/api/restaurants", createRestaurantRoutes(restaurantController));

    return app;
}

export default createApp;
