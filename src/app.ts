import express, { type Express } from "express";
import Database from "better-sqlite3";
import { createRestaurantRoutes } from "./routes/RestaurantRoutes";
import { RestaurantRepository } from "./repositories/RestaurantRepository";
import { RestaurantService } from "./services/RestaurantService";
import { RestaurantController } from "./controllers/RestaurantController";
import { errorHandler } from "./middleware/errorHandler";

function createApp(db: Database.Database) {
    const app: Express = express();

    app.use(express.json());

    const restaurantRepository = new RestaurantRepository(db);
    const restaurantService = new RestaurantService(restaurantRepository);
    const restaurantController = new RestaurantController(restaurantService);
    app.use("/api/restaurants", createRestaurantRoutes(restaurantController));

    app.use(errorHandler);

    return app;
}

export default createApp;
