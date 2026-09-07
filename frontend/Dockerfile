# Step 1: Build React Vite application
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency definition
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY . .

# Set build arguments for Vite (empty defaults to relative reverse-proxy routing)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

# Build production bundle into /app/dist
RUN npm run build

# Step 2: Serve static bundle + reverse proxy with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy Vite build output to Nginx HTML root
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
