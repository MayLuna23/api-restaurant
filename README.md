🚀 How to Run the Ocean Restaurant API

1. Clone the repository

`git clone https://github.com/MayLuna23/api-restaurant.git`
`cd api-restaurant`

2. Start the application with Docker

`docker-compose up -d`

3. Access the API

http://localhost:3000/api/v1/restaurant

4. Access to the Swagger Documentation

http://localhost:3000/docs


🍔 Ocean Restaurant API
A RESTful API for managing restaurant orders, products, and users, built with TypeScript & NestJS, Prisma, and JWT authentication

| Feature                   | Admin Only | All Users |
| ------------------------- | ---------- | --------- |
| Create products           | ✅          | ❌         |
| Create users              | ✅          | ❌         |
| Delete orders             | ✅          | ❌         |
| Filter orders by any user | ✅          | ❌         |
| View product list         | ✅          | ✅         |
| View own orders           | ✅          | ✅         |
| Filter own orders         | ✅          | ✅         |
| Create new orders         | ✅          | ✅         |

🔐 Authentication
All protected routes require JWT authentication via the Authorization header:

    Authorization: Bearer <token>

    Users must log in to obtain a valid token