# Restau-apis
Restau-api is a food delivery service application for a restaurant where logged in customers can place orders for Food items, see history of orders made and can cancel an order at anytime(only if the order is still pending).

[![Coverage Status](https://coveralls.io/repos/github/ArnauldAnguh/Restau-apis/badge.svg?branch=develop)](https://coveralls.io/github/ArnauldAnguh/Restau-apis?branch=develop)
[![Codefresh build status]( https://g.codefresh.io/api/badges/pipeline/arnauldanguh/default%2FMyBuildPipeline?key=eyJhbGciOiJIUzI1NiJ9.NWRiNWMwNjE2NWM5ZWEzNzJkMmRiMThk.SNzGmzovsYS_QW0RAOQPag3gAiUUy4vb0CiTtWZciJs&type=cf-1)]( https://g.codefresh.io/pipelines/MyBuildPipeline/builds?filter=trigger:build~Build;pipeline:5db5c3a414a6bd35adfa375a~MyBuildPipeline)

# API
**Required features**
  1. Users can create an account and log in
  2. A user should be able to order for food
  3. The admin user should be able to add, edit or delete food items
  4. The admin should be able to see a list of food items
  5. The admin user should be able to do the following
     a. See a list of orders
     b. Accept and decline orders
     c. Mark orders as completed
  6. A user should be able to see a history of ordered food

**Added features**
  1. user can get a menu of availabe food items
  2. admin can add admin users
  3. admin can delete a specific user
  4. admin can delete a food Item
  5. both admin and users can delete/cancel a specific order
  6. user can update the status of an order
  7. user can search for a particular food item
  8. admin can add optional food items to the menu
  9. logged in users can logout from app

**Optional features**
  1. User can search for country foods
  2. admin can add drink options to menu
  3. admin users can accept payments via several methods

# Endpoints

**Auth Endpoints**

  | Endpoints | Functionalities | Request params |
  | ------------- | ------------- | ------------- |
  | POST  `/api/v1/auth/signup` | registers a user | |
  | POST  `/api/v1/auth/login` | signs in a user | |
  | PUT  `/api/v1/auth/:user_id` | updates a user | user_id |
  | DELETE  `/api/v1/auth/:user_id` | admin user can delete a user | user_id |
  | POST  `/api/v1/auth/logout` | signs out a user | |


**Food item Endpoints**

  | Endpoints | Functionalities | Request params |
  | ------------- | ------------- | ------------- |
  | GET  `/api/v1/foodItems/` | gets available food items |
  | GET  `/api/v1/foodItems/menu` | gets menu |
  | GET  `/api/v1/foodItems/:foodItemId` | gets a specific food item | foodItemId |
  | PATCH  `/api/v1/foodItems/:foodItemId` | updates a food item | foodItemId |
  | DELETE  `/api/v1/foodItems/:foodItemId` | deletes a food item | foodItemId |
  | POST  `/api/v1/foodItems/:searchKey` | searches a food item | searchKey |


**User Order Endpoints**

  | Endpoints | Functionalities | Request params |
  | ------------- | ------------- | ------------- |
  | GET  `/api/v1/orders/`| fetch all orders | |
  | GET  `/api/v1/orders/:order_id` | fetch order by id | order_id |
  | POST  `/api/v1/orders/` | place an order | |
  | PUT  `/api/v1/orders/:order_id` | update an order | |
  | DELETE  `/api/v1/orders/:order_id` | delete an order | order_id |


# Examples - Auths

**Sign up a user**

  URL: `http://localhost:3000/api/v1/auth/signup`
  
  Request Type: POST
  
  Response: 
``` 
{
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsI...",
        "user": {
            "id": 2,
            "role": "user",
            "username": "jackson",
            "email": "thriller@gmail.com",
            "password": "$2b$10$zewJ...",
            "created_at": "2019-10-14T18:47:27.965Z",
            "updated_at": null
        }
    },
    "message": "Signup Successful!"
}
```

**Sign in a user**

  URL: `http://localhost:3000/api/v1/auth/login`
  
  Request Type: POST
  
  Response:
 ```
 {
        "token": "eyJhbGciOiJIUzI1NiI...",
        "user": {
            "id": 2,
            "role": "user",
            "username": "jackson",
            "email": "thriller@gmail.com",
            "created_at": "2019-10-14T18:47:27.965Z",
            "updated_at": null
        }
    "message": "Sign in successful"
}
```

**Update a user**

  URL: `http://localhost:3000/api/v1/auth/:user_id`
  
  Request Type: PUT
  
  Response: 
 ```
 {
    "data": {
        "id": 2,
        "role": "user",
        "username": "jane jackson",
        "email": "thriller@gmail.com",
        "password": "$2b$10$5JSVTOV...",
        "created_at": "2019-10-14T18:47:27.965Z",
        "updated_at": "2019-10-14T19:30:26.114Z"
    },
    "message": "User successfully updated"
}
```

**Logout a user**

  URL: `http://localhost:3000/api/v1/auth/logout`
  
  Request Type: POST
  
  Response:
  ```
  {
    "results": {
        "id": 12,
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "created_at": "2019-10-14T19:32:38.068Z"
    },
    "message": "user successfully signed Out!"
}
```

# Examples - Food Items

**Fetch food items**

  URL: `http://localhost:3000/api/v1/foodItems`
  
  Request Type: GET
  
  Response: 
 ```
 {
    "data": [
        {
            "id": 1,
            "name": "Vegetable Salad!",
            "image": "http://via.placeholder.com/170x170",
            "description": "Good",
            "quantity": 4,
            "unit_price": 500,
            "created_at": "2019-10-13T22:41:43.889Z",
            "updated_at": null
        }
    ],
    "message": "success"
}
```

**Fetch a particular food item**

  URL: `http://localhost:3000/api/v1/foodItems/1`
  
  Request Type: GET
  
  Response: 
```
{
    "data": {
        "id": 1,
        "name": "Vegetable Salad!",
        "description": "Good",
        "quantity": 4,
        "price": 0,
        "item_image": "http://via.placeholder.com/170x170",
        "created_at": "2019-10-13T22:41:43.889Z",
        "updated_at": null
    },
    "message": "success in fetching item 1"
}
```

**Create a food item**

  URL: `http://localhost:3000/api/v1/foodItems/`
  
  Request Type: POST
  
  Response: 
  ```
  {
    "data": [
        {
            "id": 2,
            "name": "grain",
            "image": "https://via.placeholder.com/150/000000/FFFFFF/?text=Food Item",
            "description": "bassa and falla ina ...",
            "quantity": 35,
            "unit_price": 245,
            "created_at": "2019-10-14T20:27:12.448Z",
            "updated_at": null
        }
    ],
    "message": "Food item created successfully"
}
```
# Examples - User Orders

**Fetch Orders**

  URL: `http://localhost:3000/api/v1/orders`

  Request Type: GET
  
  Response:
 ```
 {
    "orders": [
        {
            "id": 1,
            "customer_id": 3,
            "total_price": 20,
            "status": "NEW",
            "created_at": "2019-10-14T21:35:24.757Z",
            "updated_at": null,
            "item": "rice, eggs, chicken"
        },
        {
            "id": 2,
            "customer_id": 3,
            "total_price": 3,
            "status": "NEW",
            "created_at": "2019-10-14T21:39:36.450Z",
            "updated_at": null,
            "item": "Humburger,cheese, chicken"
        }
    ],
    "message": "successfully fetched orders "
}
```

**Fetch a particular order**

  URL: `http://localhost:3000/api/v1/orders/1`
  
  Request Type: GET
  
  Response:
 ```
 {
    "order": {
        "id": 1,
        "customer_id": 3,
        "total_price": 20,
        "status": "NEW",
        "created_at": "2019-10-14T21:35:24.757Z",
        "updated_at": null,
        "item": "rice, eggs, chicken"
    },
    "message": "Order Found"
}
```

**Create an order**

  URL: `http://localhost:3000/api/v1/orders`
  
  Request Type: POST
  
  Response: 
 ```
 {
    "data": [
        {
            "id": 2,
            "customer_id": 3,
            "total_price": 3,
            "status": "NEW",
            "created_at": "2019-10-14T21:39:36.450Z",
            "updated_at": null,
            "item": "Humburger,cheese, chicken"
        }
    ],
    "message": "Order placed successfully"
}
```

**Update an order**

  URL: `http://localhost:3000/api/v1/orders/1`
  
  Request Type: PUT
  
  Response:
  ``` 
  {
    "data": {
        "id": 1,
        "customer_id": 3,
        "total_price": 5,
        "status": null,
        "created_at": "2019-10-14T21:35:24.757Z",
        "updated_at": "2019-10-14T22:06:46.600Z",
        "item": "Achu"
    },
    "success": "Order status updated"
}
```

**Delete an order**

  URL: `http://localhost:3000/api/v1/orders/2`
  
  Request Type: DELETE
  
  Response:
  
 ``` 
 {
    "message": "Order successfully deleted"
  }
```

