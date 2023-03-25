const { Client } = require('twitter-api-sdk');
const { tweets } = require('./mockTwitterApi');
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

/**
 * Recursively fetches tweets from Twitter API
 * @param {string} userId
 * @param {string} [pagination_token]
 */
const fetchTweetsRecursively = async ({ userId, pagination_token }) => {
  const opts = {
    maxResults: 100,
  }
  if (pagination_token) {
    opts.pagination_token = pagination_token;
  }
  const usersTweets = await client.tweets.usersIdTweets(userId, opts);

  for await (const tweet of usersTweets.data) {
    tweets.push(tweet);
  }

  if (tweets.length >= 100 || usersTweets.data.length === 0) {
    return tweets;
  }

  return fetchTweetsRecursively({ userId, pagination_token: usersTweets.meta.next_token });
}

/**
 * Fetch last 100 tweets
 * @param {string} userId
 * @returns {Promise<Array>}
 */
module.exports.fetchTweets = async (userId) => {
  // mock for testing
  if (env === 'test') {
    return mockTwitterApi.tweets.data;
  }

  return await fetch({ userId });
}

/**
 * Fetch user
 * @param {string} username
 * @returns Object
 */
module.exports.fetchUser = async (username) => {
  // mock for testing
  if (env === 'test') {
    return mockTwitterApi.users.data;
  }

  const user = await client.users.findUserByUsername(username);
  return user;
}
