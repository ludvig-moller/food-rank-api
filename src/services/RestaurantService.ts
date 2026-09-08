import { RestaurantRepository } from "../repositories/RestaurantRepository";
import { RestaurantQuery } from "../types/RestaurantQuery";

export class RestaurantService {
    private readonly restaurantRepository: RestaurantRepository;

    constructor(restaurantRepository: RestaurantRepository) {
        this.restaurantRepository = restaurantRepository;
    }

    get(query: RestaurantQuery) {
        return this.restaurantRepository.get(query);
    }
}
