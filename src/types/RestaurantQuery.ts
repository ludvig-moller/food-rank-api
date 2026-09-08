
export type RestaurantQuery = {
    page: number;
    limit: number;
    sort: "restaurant_name" | "created_at";
    order: "asc" | "desc";
    country?: string;
    city?: string;
};
