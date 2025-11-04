# Base image
FROM node:20-alpine

# Working directory
WORKDIR /app

# Dependencies instalation
COPY package*.json ./
RUN npm install

# Code to copy
COPY . .

# Environment variables
ENV PORT=5000

# Start
CMD ["npm", "run", "dev"]