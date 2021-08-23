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

EOF

echo 'populating done !!'
