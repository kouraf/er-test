#!/usr/bin/env bash

echo 'populating db...'

mongo -- "$MONGO_DB" <<EOF
var rootUser = '$MONGO_INITDB_ROOT_USERNAME';
var rootPassword = '$MONGO_INITDB_ROOT_PASSWORD';
var admin = db.getSiblingDB('admin');
admin.auth(rootUser, rootPassword);
var user = '$MONGO_USERNAME';
var passwd = '${MONGO_PASSWORD}';
db.createUser({user: user, pwd: passwd, roles: [ {role: 'readWrite',db: '$MONGO_DB' }]});
db = db.getSiblingDB('$MONGO_DB');
admin.logout()

db.auth(user, passwd);
db.createCollection('users');
db.users.insert({email_verified: true,roles: ['SUPERADMIN'], status: 'enabled',fname: 'superadmin',lname: 'superadmin',email: "$SUPER_ADMIN_EMAIL",password: "$SUPER_ADMIN_PASSWORD",phone: '3825396997' });

EOF

echo 'populating done !!'
