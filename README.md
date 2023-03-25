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

## Twitter API

It uses official twitter SDK.
Here's useful links for documentation:

### Tweet
https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference/get-users-id-tweets

### Media
https://developer.twitter.com/en/docs/twitter-ads-api/creatives/guides/media-library

### User
https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-by-username-username


### TODO
- [ ] add user verification info (verified, verified_type)