# build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# serve
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# 讓 SPA refresh 不 404（可選，但通常需要）
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80