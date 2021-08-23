# Easy Relay test

Notification system example

# Assumptions

1. Every user type can send notification to everyone.
2. Notifications are templates that just need to be filled with credentials.

# Architecture

it's a classic microservice architecture.
![image](./Archi.png)

# System Requirements

1. Docker
2. [Mailtrap](https://mailtrap.io/) account
3. [Nexmo](https://dashboard.nexmo.com/) account

# Configuration

The configuration is loaded from .env file located in the root of the project:

```
# Mongo DB Vars
MONGO_USERNAME=admin
MONGO_PASSWORD=password
MONGO_DB=ER-test
MONGODB_URI='mongodb://mongo:27017/er-test-'
MONGO_PORT=27017
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password
MONGO_INITDB_DATABASE=ER-test
AUTH_SOURCE=ER-test

SUPER_ADMIN_EMAIL=superadmin@test.com
SUPER_ADMIN_PASSWORD=$2b$10$iEqBP6YbebLzk1p34dRivuhn2KdVejAW2XuHAKfeTXzB1CXGt42DO


# Email
EMAIL_USER=*****
EMAIL_PASSWORD=****
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525

# JWT
JWT_EXPIRATION=1d
JWT_SECRET=xxx

# Nexmo client config
VONAGE_API_KEY=*****
VONAGE_API_SECRET=*****


PHONE=******

```

NB: All these fields are required in order to work correctly.
Rename `.env.example` to `.env` and add you config

# Running

## Prerequisites

1. Installing Docker
2. Installing Docker Compose
3. Signing Up for free in [Mailtrap](https://mailtrap.io/) to get your `EMAIL_USER` and `EMAIL_PASSWORD`. [Mailtrap](https://mailtrap.io/) is a service for capturing all SMTP traffic from dev environments in one place
4. Signing Up for free in [Nexmo](https://dashboard.nexmo.com/) to get your `VONAGE_API_KEY` and `VONAGE_API_SECRET`. [Nexmo](https://dashboard.nexmo.com/) provides us with many communications APIs, we are going to use the SMS api programmatically send text messages.

   NB: we are using the free tier so we will only be able to send sms to our own phone number only, that's why you should fill `PHONE` with your number in `.env` file.

5. Since we are using Whatsapp the first time you'll use the `notification` service, you'll need to scan the QR code in the docker terminal.

## Running a Container with Docker Compose

`docker-compose up -d --build`

## docker compose configuration file

The API is composed of five services:

1. `user_service`: node express backend handling users and auth.
2. `notification_service`: node express backend handling notification.
3. `user_service_mongo`: mongodb for the user service.
4. `notification_service_mongo`: mongodb for the notification service.
5. `gateway` : nginx a reverse proxy/ api gateway.

## Mongodb initialization

Setting `MONGO_INITDB_ROOT_USERNAME` , `MONGO_INITDB_ROOT_PASSWORD` as envirennement variables will create super user with role "root" in admin database at the container startup.

NB: The variables above will have any effect if you start the container with a data directory that already contains a database: any pre-existing database will always be left untouched on container startup.

The script `docker-entrypoint/init.sh` will be executed when the container is started for the first time and use `MONGO_INITDB_DATABASE` database, the script create database user `MONGO_USERNAME` with password `MONGO_PASSWORD` in the admin database and grant read:write permissions on `MONGO_DB` database.

For more details:
https://github.com/docker-library/docs/tree/master/mongo

## Removing the Image

To free disk space remove the local image by deleting all containers that reference the image using `docker rm <container_id>`

to obtains all containers use `docker ps -a`

Once all containers that reference the image have been removed, we can remove the image:
`docker rmi <image>`

# Scenario

1. First you need to login, send a `POST` to `http://localhost:4000/api/v1/auth` with this body for example

```
{
	"email":"amine@gmail.com",
	"password":"12345678"
}
```

You'll recieve a response like this one

```
{
  "id_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjJiYzVhZDM3NDA2MDAyNzYxODhmNSIsInJvbGVzIjpbIkFETUlOIl0sImVtYWlsIjoiYW1pbmVAZ21haWwuY29tIiwibmFtZSI6ImFtaW5lIiwiaWF0IjoxNjI5NjY2NDIwLCJleHAiOjE2Mjk3NTI4MjB9.zUTu-pmq2sG8xbDXgPhl5dJgo9DDdBD6klH_kxpA7ZM",
  "timeStamp": 1629666420799,
  "id_token_expires_in": "2021-08-23T21:07:00.000Z"
}

```

2. Copy the token to the `Authorization` field of all your headers.
3. Send a GET to `http://localhost:4000/api/v1/users` to get a list of all your contacts.
4. POST to `http://localhost:4000/api/v1/notification/whatsapp` or `http://localhost:4000/api/v1/notification/email` or `http://localhost:4000/api/v1/notification/sms` with this body for example

```
{
	"to":["6122bc5ad3740600276188f4","6122bc5ad3740600276188f5"],
	"message": 1
}
```

`to` is an array of users (ID) you'll send your notifications too and `message` is the tempalate `1`,`2` or `3`. check `notification/templates/message_#number.txt` for more information.

5. TADAAAA

# Populate data

[Populate](./user/populate.data.js) script generate random data for testing purpose it's automatically called when `user_service` container is starting.

# Testing

The `user` micro-service is using jest and supertest testing frameworks. The test files are under the `__tests__` directory,

`> cd user`

Run All Tests :

`> npm test`

Run Routes Tests :

`> npm run test-routes`

Run Models Tests:

`> npm run test-models`

Run Controllers Tests:
`> npm run test-controllers`

Run Authentication Tests:
`> npm run test-auth`

# Dependencies

Check `./user/package.json` and `./notification/package.json`

# API Reference

Open [openapi.yaml](./openapi.yaml) with gitlab or swagger ui to get more details.
