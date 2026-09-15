import { NextFunction, Request, Response } from "express";
import { ReviewService } from "../services/ReviewService";
import { parseDto } from "../utils/parseDto";
import { reviewQuerySchema } from "../schemas/reviews/reviewQuerySchema";
import { BadRequestError } from "../errors/BadRequestError";

export class ReviewController {
    private readonly reviewService: ReviewService;

    constructor(reviewService: ReviewService) {
        this.reviewService = reviewService;
    }

    get = (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = parseDto(reviewQuerySchema, req.query);

            const restaurants = this.reviewService.get(query);

            return res.status(200).json(restaurants);
        } catch(err) {
            next(err);
        }
    }

    getById = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (typeof id !== "string")
                throw new BadRequestError("Invalid restaurant ID");

            const restaurant = this.reviewService.getById(id);

            return res.status(200).json(restaurant);
        } catch(err) {
            next(err);
        }
    }
}
