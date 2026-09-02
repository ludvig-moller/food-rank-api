
### restaurants

| Column          | Data Type | Constraints               |
|-----------------|-----------|---------------------------|
| id              | TEXT      | PRIMARY KEY               |
| restaurant_name | TEXT      | NOT NULL, MAX LENGTH 100  |
| description     | TEXT      | NOT NULL, MAX LENGTH 1000 |
| country         | TEXT      | NOT NULL, MAX LENGTH 100  |
| city            | TEXT      | NOT NULL, MAX LENGTH 100  |
| created_at      | TIMESTAMP | NOT NULL                  |

### dishes

| Column        | Data Type | Constraints                             |
|---------------|-----------|-----------------------------------------|
| id            | TEXT      | PRIMARY KEY                             |
| restaurant_id | TEXT      | NOT NULL, FOREIGN KEY → restaurants(id) |
| dish_name     | TEXT      | NOT NULL, MAX LENGTH 100                |
| description   | TEXT      | NOT NULL, MAX LENGTH 500                |
| price         | INTEGER   | NOT NULL                                |
| created_at    | TIMESTAMP | NOT NULL                                |

### reviews

| Column      | Data Type | Constraints                        |
|-------------|-----------|------------------------------------|
| id          | TEXT      | PRIMARY KEY                        |
| dish_id     | TEXT      | NOT NULL, FOREIGN KEY → dishes(id) |
| rating      | INTEGER   | NOT NULL                           |
| description | TEXT      | NOT NULL, MAX LENGTH 1000          |
| created_at  | TIMESTAMP | NOT NULL                           |
