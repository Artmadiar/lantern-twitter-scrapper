# lantern-twitter-scrapper

Twitter scraper service that returns PDF of the last 100 tweets for a given username.

To make it happen run the server and send [POST] request `/tweets`


## Development

1. copy .env.example file for your local .env and set vars
2. npm i
3. npm run dev (it requires nodemon)

## Production

1. copy .env.example file for your local .env and set vars
2. npm i
3. pm2 start (it requires pm2)
