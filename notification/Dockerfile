FROM node:alpine
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN apk add chromium

RUN apk add python3 make gcc g++

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# create db data folder
RUN mkdir -p /data/db

# Bundle app source
COPY . . 

EXPOSE 4002
 
CMD npm start
