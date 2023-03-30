const path = require('path');

// parse tweet id from link
function getTweetId(link) {
  const regex = /\/status\/(\d+)/;
  const match = link.match(regex);
  if (match) {
    return match[1];
  } else {
    return null;
  }
}

/**
 * Open page of tweet and save screenshot
 * 
 * @param {Browser} browser puppeteer browser
 * @param {string} link link of tweet
 * @returns {Promise<void>}
 */
module.exports = async function saveTweet({ browser, username, link, orderNumber }) {
  const tweetId = getTweetId(link);
  const page = await browser.newPage();
  // set user agent (override the default headless User Agent) and viewport
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36');
  await page.setViewport({width: 1024, height: 2048, deviceScaleFactor: 2});

  // open page of user
  await page.goto(link, { waitUntil: 'networkidle2' });
  // wait for tweets to load
  await page.waitForSelector('[data-testid="tweet"]');
  // close notification popup
  await page.evaluate(() => {
    // wait a second
    setTimeout(() => {
      const popupCloseButton = document.querySelector('[data-testid="app-bar-close"]');
      if (popupCloseButton) {
        popupCloseButton.click();
      }
    }, 500);
  });
  await new Promise(resolve => setTimeout(resolve, 500));

  // page loads many tweets but we want to select tweet with proper link
  const relativeLink = link.replace('https://twitter.com', '');
  const tweet = await page.$(`[data-testid="tweet"]:has(a[href="${relativeLink}"])`);

  await tweet.screenshot({
    path: path.resolve(__dirname, `../../data/${username}/${orderNumber}_${tweetId}.png`),
    // captureBeyondViewport: false,
    // fromSurface: false,
  });

  await page.close();
}
