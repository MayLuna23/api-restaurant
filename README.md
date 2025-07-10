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