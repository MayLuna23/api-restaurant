# Base image
FROM node:22

# Set working directory
WORKDIR /app

# Copy config files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Development command: run migrations, seed database, and start the server
CMD npx prisma migrate dev --name init --skip-seed && npm run seed && npm run start:dev
