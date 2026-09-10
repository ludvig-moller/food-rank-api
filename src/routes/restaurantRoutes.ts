import { Router } from "express";
import { RestaurantController } from "../controllers/RestaurantController";

export const createRestaurantRoutes = (restaurantController: RestaurantController) => {
    const router = Router();

    router.get("/", restaurantController.get);
    router.get("/:id", restaurantController.getById);
    router.post("/", restaurantController.create);

    return router;
}
