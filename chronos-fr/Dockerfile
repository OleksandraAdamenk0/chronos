# prod

## Node for build
#FROM node:20-alpine AS build
#LABEL authors="oleksandra"
#
#WORKDIR /app
#
## Dependencies
#COPY package*.json ./
#RUN npm install
#
## Code
#COPY . .
#
## project
#RUN npm run build
#
## nginx serves React
#FROM nginx:alpine
#COPY --from=build /app/dist /usr/share/nginx/html
#
## Port 3000
#EXPOSE 3000
#
#CMD ["nginx", "-g", "daemon off;"]


# dev

# chronos-fe/Dockerfile.dev
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
