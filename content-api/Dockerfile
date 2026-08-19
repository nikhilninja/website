FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --production

# Copy application files
COPY server.js ./

# Ensure data and uploads folders exist
RUN mkdir -p /app/data /app/uploads

EXPOSE 3001

CMD ["node", "server.js"]
