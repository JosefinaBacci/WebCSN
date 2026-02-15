FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src ./src
CMD ["sh", "-c", "node src/consumer.js & node src/server.js"]
