/**
 * Open page of user and get last {tweetCount} tweets
 * 
 * @param {Browser} browser puppeteer browser
 * @param {string} username
 * @param {number} tweetCount number of tweets to parse
 * @returns {Promise<string[]>} list of tweet links
 */
module.exports = async function getTweets({ browser, username, tweetCount }) {
  const page = await browser.newPage();
  // set user agent (override the default headless User Agent) and viewport
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.192 Safari/537.36');
  await page.setViewport({width: 1024, height: 2048, deviceScaleFactor: 2});

  // open page of user
  await page.goto(`https://twitter.com/${username}`, { waitUntil: 'networkidle2' });
  // wait for tweets to load
  await page.waitForSelector('[data-testid="tweet"]');

  // run js code in browser to parse tweets
  const links = await page.evaluate(async ({ username, tweetCount }) => {
    // collect links of tweets in list
    var list = [];
    // if no new tweets are found more than 5 times, then stop scrolling
    var emptyResultsDetected = 0;

    /**
     * parse tweets and add links to list
     * @returns {number} number of new tweets added to the list
     */
    function getTweets() {
      console.log('parsing tweets...');
      var newTweetsCount = 0;
      document.querySelectorAll('[data-testid="cellInnerDiv"]').forEach((element) => {
        // get link of tweet
        var a = element.querySelector('a[href*="status"]');
        if (a && a.href) {
          if (!list.includes(a.href) && a.href.includes(username)) {
            list.push(a.href);
            newTweetsCount++;
          }
        }
      });

      return newTweetsCount;
    }

    /**
     * Recursively scroll down and parse tweets until {tweetCount} tweets are found (or no new tweets are found 5 times)
     * @returns {Promise<void>}
     */
    async function parseAndscrollDown() {
      var newTweetsCount = getTweets();
      console.log('tweets added:', newTweetsCount);

      if (newTweetsCount === 0) {
        emptyResultsDetected++;
      }

      if (emptyResultsDetected > 5 || list.length > tweetCount) {
        console.log('done! tweets found:', list.length);
        return;
      }
      
      window.scrollBy(0, window.innerHeight);
      console.log('scrolling down and wait for 2s...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return parseAndscrollDown();
    }

    await parseAndscrollDown();
    return list;

  // set timeout to 10 minutes
  }, { username, tweetCount }, { timeout: 600000 });

  const result = links.slice(0, tweetCount);
  
  await page.close();
  return result;
}
