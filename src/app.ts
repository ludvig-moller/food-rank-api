import express, { type Express } from "express";
import Database from "better-sqlite3";
import { createRestaurantRoutes } from "./routes/RestaurantRoutes";
import { RestaurantRepository } from "./repositories/RestaurantRepository";
import { RestaurantService } from "./services/RestaurantService";
import { RestaurantController } from "./controllers/RestaurantController";
import { errorHandler } from "./middleware/errorHandler";
import { DishRepository } from "./repositories/DishRepository";
import { DishService } from "./services/DishService";
import { DishController } from "./controllers/DishController";
import { createDishRoutes } from "./routes/dishRoutes";
import { ReviewRepository } from "./repositories/ReviewRepository";
import { ReviewService } from "./services/ReviewService";
import { ReviewController } from "./controllers/ReviewController";
import { createReviewRoutes } from "./routes/reviewRoutes";

function createApp(db: Database.Database) {
    const app: Express = express();

    app.use(express.json());

    const restaurantRepository = new RestaurantRepository(db);
    const restaurantService = new RestaurantService(restaurantRepository);
    const restaurantController = new RestaurantController(restaurantService);
    app.use("/api/restaurants", createRestaurantRoutes(restaurantController));

    const dishRepository = new DishRepository(db);
    const dishService = new DishService(dishRepository, restaurantRepository);
    const dishController = new DishController(dishService);
    app.use("/api/dishes", createDishRoutes(dishController));

    const reviewRepository = new ReviewRepository(db);
    const reviewService = new ReviewService(reviewRepository);
    const reviewController = new ReviewController(reviewService);
    app.use("/api/reviews", createReviewRoutes(reviewController));

    app.use(errorHandler);

    return app;
}

export default createApp;
