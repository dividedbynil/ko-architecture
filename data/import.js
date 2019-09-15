use kane

db.restaurants.createIndex( { location : "2dsphere" } )
db.users.createIndex( { email: 1 }, { unique: true } )
