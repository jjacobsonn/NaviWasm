# Stage 1: Build environment
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package*.json ./
RUN npm ci

# Copy source files
COPY public ./public
COPY src ./src
COPY tsconfig.json ./
COPY .env* ./

# Set build arguments
ARG REACT_APP_API_URL
ARG REACT_APP_MAPBOX_ACCESS_TOKEN

# Build the app
RUN npm run build

# Stage 2: Production environment
FROM nginx:alpine

# Copy built app from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
