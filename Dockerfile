FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g typescript

COPY package*.json ./

RUN npm install

# RUN npm install --save-dev

COPY . .

RUN npm run build

FROM nginx:stable-alpine as production

WORKDIR /app

COPY --from=builder /app/dist /usr/share/app/html/vm1

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173