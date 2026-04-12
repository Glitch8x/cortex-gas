# Use official Node.js 23 slim image as per Nosana Builders Challenge requirements
FROM node:23-slim

# Install necessary build tools for native dependencies and plugins
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory inside the container
WORKDIR /app

# Copy package descriptors first to leverage Docker cache for dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy all application files (excluding those in .dockerignore)
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose port configuration matching local Express server setup
EXPOSE 3000

# Set environment variables for production execution
ENV NODE_ENV=production
ENV PORT=3000

# Command to ignite the CortexGas Alpha Engine
CMD ["npm", "start"]
