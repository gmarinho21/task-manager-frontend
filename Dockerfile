# build step
FROM node:18.17.1-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

# release step
FROM nginx:1.27.0-alpine as release
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]