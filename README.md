# K.O Architecture Demo - [article](https://medium.com/@qualiable/a-minimalist-architecture-pattern-for-expressjs-api-applications-2290de42ece7)
- Framework: ExpressJS
- Database: MongoDB
- Authentication: JSON Web Token

## Experiment data
- origin: [restaurants.json](https://raw.githubusercontent.com/mongodb/docs-assets/geospatial/restaurants.json)

## APIs document
Postman APIs collection and environment can be imported from `./postman/`

## Pre-running
Add a `./config.js` file
```
module.exports = {
  saltRounds: 10,
  jwtSecretSalt: '87908798',
  devMongoUrl: 'mongodb://localhost/kane',
  prodMongoUrl: 'mongodb://localhost/kane',
}
```

## Import experiment data

### Open a terminal and run:
```
mongod
```

### Open another terminal in this directory:
```
sh ./data/import.sh
```

## Start the server with
```
npm start
```

## Start development with
```
npm run dev
```
