module.exports = {
	saltRounds: Math.floor(Math.random()*10),
  jwtSecretSalt: [...Array(9)].map(() => Math.random().toString(36)[2]).join(''),
  devMongoUrl: 'mongodb://localhost/kane',
  prodMongoUrl: 'mongodb://localhost/kane',
  testMongoUrl: 'mongodb://localhost/test',
}
