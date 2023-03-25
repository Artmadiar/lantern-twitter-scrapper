const { Client } = require('twitter-api-sdk');
const mockTwitterApi = require('./mockTwitterApi');

const env = process.env.NODE_ENV || 'development';
const twitterToken = process.env.TWITTER_BEARER_TOKEN;

// Check for required environment variables in prod env
if (env !== 'test') {
  if (!process.env.TWITTER_BEARER_TOKEN) {
    throw new Error(`Environment variable "TWITTER_BEARER_TOKEN" is missing`);
  }
}

// Initialize Twitter API SDK
const client = new Client(twitterToken);

module.exports.fetchTweets = async (userId) => {
  const tweets = [];

  // mock for testing
  if (env === 'test') {
    return mockTwitterApi.tweets.data;
  }

  const usersTweets = await twitterClient.tweets.usersIdTweets(userId);

  for await (const tweet of usersTweets.data) {
    tweets.push(tweet);
  }

  return tweets;
}

module.exports.fetchUser = async (username) => {
  // mock for testing
  if (env === 'test') {
    return mockTwitterApi.users.data;
  }

  const user = await client.users.findUserByUsername(username);
  return user;
}
