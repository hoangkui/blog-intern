# Base image
FROM --platform=linux/amd64 node:16
# Create app directory
WORKDIR /usr/src/app



ENV URL_DATABASE="mongodb+srv://hoangkui:hoangkui2357@blog.ahvbzxu.mongodb.net/?retryWrites=true&w=majority"
ENV SECRET_KEY="hoangkuikey"
ENV REFRESH_KEY="hoangkuirefresh"
ENV TOKEN_TIME="60000"
ENV REFRESH_TIME="600000"
ENV PORT=80
ENV ADMIN_EMAIL_ADDRESS=hoangkui2001@gmail.com
ENV ADMIN_EMAIL_PASS=nbgfskwgjwkuanwh
ENV URL_CLIENT=https://hoangnt.internship.designveloper.com

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json .
COPY yarn.lock . 

# Install app dependencies
RUN yarn install

# Bundle app source
COPY . .
# Creates a "dist" folder with the production build
RUN yarn run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
