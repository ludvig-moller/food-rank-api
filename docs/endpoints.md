
GET /restaurants - Returns all restaurants
    ?page
    ?limit
    ?sort
    ?order
    ?country
    ?city

GET /restaurants/:id - Returns a restaurant

POST /restaurants - Create a restaurant

PUT /restaurants/:id - Update a restaurant

DELETE /restaurants/:id - Delete a restaurant


GET /dishes - Returns all dishes
    ?page
    ?limit
    ?sort
    ?order
    ?restaurant_id

GET /dishes/:id - Returns a dish

POST /dishes - Creates a dish

DELETE /dishes/:id - Delete a dish


GET /reviews - Returns all reviews
    ?page
    ?limit
    ?sort
    ?order
    ?dish_id

GET /reviews/:id - Returns a review

POST /reviews - Creates a review
