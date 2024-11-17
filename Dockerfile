# Dockerfile for Vite React client

# Stage 1: Build the React app
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set build arguments with default values
ARG SERVER_ADDRESS
ARG SERVER_PORT

# Ensure the build arguments are passed into config.json correctly
RUN sed -i "s|\"SERVER_ADDRESS\": \"\"|\"SERVER_ADDRESS\": \"$SERVER_ADDRESS\"|g" src/config/config.json
RUN sed -i "s|\"SERVER_PORT\": \"\"|\"SERVER_PORT\": \"$SERVER_PORT\"|g" src/config/config.json


# Build the app for production
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Remove default Nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy built files to Nginx directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
