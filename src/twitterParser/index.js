const bluebird = require('bluebird');
const puppeteer = require('puppeteer');

const getTweets = require('./getTweets');
const saveTweet = require('./saveTweet');
const prepareUserFolder = require('./prepareUserFolder');

const headless = process.env.PUPPETEER_HEADLESS === 'true';

let browser;

module.exports.parseUser = async function parseUser({ username, tweetCount = 100 }) {
  if (!browser) {
    throw new Error('Browser is not initialized');
  }

  // create folder for user
  prepareUserFolder(username);

  console.log('parsing user...');
  const links = await getTweets({ browser, username, tweetCount });
  console.log('parsed links:', links.length);

  await bluebird.each(links, async (link, i) => {
    console.log('saving tweet:', link);
    await saveTweet({ browser, username, link, orderNumber: i+1 });
  });

  return links;
}

module.exports.startBrowser = async function startBrowser() {
  browser = await puppeteer.launch({
    // hide browser window
    headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log('browser started');
}

module.exports.stopBrowser = async function stopBrowser() {
  if (browser) {
    await browser.close();
  }
}
