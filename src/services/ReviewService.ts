import { Review } from "../models/Review";
import { ReviewRepository } from "../repositories/ReviewRepository";
import { ReviewQueryDto } from "../schemas/reviews/reviewQuerySchema";

export class ReviewService {
    private readonly reviewRepository: ReviewRepository;

    constructor(
        reviewRepository: ReviewRepository,
    ) {
        this.reviewRepository = reviewRepository;
    }

    get(query: ReviewQueryDto): Review[] {
        return this.reviewRepository.get(query);
    }
}
