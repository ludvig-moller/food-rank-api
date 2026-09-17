import { NextFunction, Request, Response } from "express";
import { ReviewService } from "../services/ReviewService";
import { parseDto } from "../utils/parseDto";
import { reviewQuerySchema } from "../schemas/reviews/DTOs/reviewQuerySchema";
import { BadRequestError } from "../errors/BadRequestError";
import { reviewCreateSchema } from "../schemas/reviews/DTOs/reviewCreateSchema";

export class ReviewController {
    private readonly reviewService: ReviewService;

    constructor(reviewService: ReviewService) {
        this.reviewService = reviewService;
    }

    get = (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = parseDto(reviewQuerySchema, req.query);

            const reviews = this.reviewService.get(query);

            return res.status(200).json(reviews);
        } catch(err) {
            next(err);
        }
    }

    getById = (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;

            if (typeof id !== "string")
                throw new BadRequestError("Invalid restaurant ID");

            const review = this.reviewService.getById(id);

            return res.status(200).json(review);
        } catch(err) {
            next(err);
        }
    }

    create = (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = parseDto(reviewCreateSchema, req.body);

            const review = this.reviewService.create(data);

            return res.status(201).json(review);
        } catch(err) {
            next(err);
        }
    }
}
