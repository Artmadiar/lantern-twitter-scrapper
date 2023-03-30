require('dotenv').config();

const express = require('express');
const { startBrowser, parseUser } = require('./twitterParser');

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Puppeteer
startBrowser();

// Routes
app.post('/tweets', async (req, res) => {
  const username = req.body.username;
  const tweetCount = req.body.tweetCount;

  try {
    const links = await parseUser({ username, tweetCount });
    res.status(200).json(links);
  } catch (error) {
    console.log(error);
    res.status(500).send('Error scraping Twitter');
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = app;