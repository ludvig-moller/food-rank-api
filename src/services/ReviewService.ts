import { NotFoundError } from "../errors/NotFoundError";
import { Review } from "../models/Review";
import { DishRepository } from "../repositories/DishRepository";
import { ReviewRepository } from "../repositories/ReviewRepository";
import { ReviewCreateDto } from "../schemas/reviews/reviewCreateSchema";
import { ReviewQueryDto } from "../schemas/reviews/reviewQuerySchema";

export class ReviewService {
    private readonly reviewRepository: ReviewRepository;
    private readonly dishRepository: DishRepository;

    constructor(
        reviewRepository: ReviewRepository,
        dishRepository: DishRepository,
    ) {
        this.reviewRepository = reviewRepository;
        this.dishRepository = dishRepository;
    }

    get(query: ReviewQueryDto): Review[] {
        return this.reviewRepository.get(query);
    }

    getById(id: string): Review {
        const review = this.reviewRepository.getById(id);

        if (!review)
            throw new NotFoundError("Review not found");

        return review;
    }

    create(data: ReviewCreateDto): Review {
        const dish = this.dishRepository.getById(data.dish_id);

        if (!dish)
            throw new NotFoundError("Dish not found");
        
        return this.reviewRepository.create(data);
    }
}
