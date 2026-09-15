import { Router } from "express";
import { ReviewController } from "../controllers/ReviewController";

export const createReviewRoutes = (reviewController: ReviewController) => {
    const router = Router();

    router.get("/", reviewController.get);
    router.get("/:id", reviewController.getById);
    router.post("/", reviewController.create);

    return router;
}