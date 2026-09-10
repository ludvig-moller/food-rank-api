import { NotFoundError } from "../errors/NotFoundError";
import { Restaurant } from "../models/Restaurant";
import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { RestaurantCreateDto } from "../schemas/restaurantCreateSchema";
import { RestaurantQueryDto } from "../schemas/restaurantQuerySchema";

export class RestaurantService {
    private readonly restaurantRepository: RestaurantRepository;

    constructor(restaurantRepository: RestaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    get(query: RestaurantQueryDto): Restaurant[] {
        return this.restaurantRepository.get(query);
    }

    getById(id: string): Restaurant {
        const restaurant = this.restaurantRepository.getById(id);

        if (!restaurant)
            throw new NotFoundError("Restaurant not found");

        return restaurant;
    }

    create(data: RestaurantCreateDto) {
        return this.restaurantRepository.create(data);
    }
}
