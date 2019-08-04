

curl -XPOST http://localhost:5050/users --data @createUser.json

curl -XPOST http://localhost:5050/users -H 'content-type: application/json; charset=UTF-8' --data listUsers.json