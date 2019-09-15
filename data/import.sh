set -eo pipefail

mongo < import.js

mongoimport --db kane --collection restaurants --file restaurants.json
mongoimport --db kane --collection users --file users.json
