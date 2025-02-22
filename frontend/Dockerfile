FROM node:18

# Set the Node option to use the legacy OpenSSL provider.
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /app

# Copy package files and install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the files.
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
