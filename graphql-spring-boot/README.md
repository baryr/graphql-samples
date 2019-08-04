Fetching schema
http://localhost:8080/graphql/schema.json


Quering data
curl -v -XPOST http://localhost:8080/graphql -H 'content-type: application/json; charset=UTF-8' --data @recentPosts.json


curl -v -XPOST http://localhost:8080/graphql -H 'content-type: application/json; charset=UTF-8' --data @writePost.json
