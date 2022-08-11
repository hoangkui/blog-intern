FROM --platform=linux/amd64 node:16-alpine AS builder 

WORKDIR /app

# ENV
ENV VITE_URL_SERVER="https://hoangnt.api.internship.designveloper.com/graphql"
ENV VITE_URL_SERVER_SOCKET="wss://hoangnt.api.internship.designveloper.com/graphql"
ENV VITE_URL_IMG="https://api.cloudinary.com/v1_1/dd8b69mls/image/upload"
ENV VITE_API_KEY_CLOUDINARY="174989952789425"
ENV VITE_UPLOAD_PRESET="iinnk03t"
ENV PORT=80

# install package
COPY package*.json .
COPY yarn.lock . 
RUN yarn install

# build -> forder build or dist
COPY . .
RUN yarn build


FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production

# Copy built/dist assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html
# Add your nginx.conf
COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port
EXPOSE 80
# Start nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
