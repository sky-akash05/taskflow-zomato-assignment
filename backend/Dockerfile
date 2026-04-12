FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (disable strict SSL for corporate proxies)
RUN npm config set strict-ssl false && npm install

# Copy application files
COPY . .

# Expose port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]
