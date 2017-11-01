FROM node:8.8.1
WORKDIR /app
ADD package.json .
RUN npm install
