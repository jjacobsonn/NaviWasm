FROM node:14-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files and build the app
COPY . .
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 3000

# Serve the built app using a simple static server (install 'serve' if not already)
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
