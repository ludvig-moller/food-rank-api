import { Router } from "express";
import { DishController } from "../controllers/DishController";

export const createDishRoutes = (dishController: DishController) => {
    const router = Router();

    router.get("/", dishController.get);
    router.get("/:id", dishController.getById);
    router.post("/", dishController.create);

    return router;
}
