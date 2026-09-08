import { NotFoundError } from "../errors/NotFoundError";
import { Restaurant } from "../models/Restaurant";
import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { RestaurantQuery } from "../types/RestaurantQuery";

export class RestaurantService {
    private readonly restaurantRepository: RestaurantRepository;

    constructor(restaurantRepository: RestaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    get(query: RestaurantQuery): Restaurant[] {
        return this.restaurantRepository.get(query);
    }

    getById(id: string): Restaurant {
        const restaurant = this.restaurantRepository.getById(id);

        if (!restaurant)
            throw new NotFoundError("Restaurant not found");

        return restaurant;
    }
}
