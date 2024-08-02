# build step
FROM node:18.17.1-alpine as build
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . ./

# Build arguments for Vite
ARG VITE_BACKEND_URL

# Pass build arguments as environment variables for Vite
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL


RUN npm run build

# release step
FROM nginx:1.27.0-alpine as release
COPY --from=build /app/dist /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]