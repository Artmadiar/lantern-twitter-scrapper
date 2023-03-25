require('dotenv').config();

const express = require('express');
const { fetchUser, fetchTweets } = require('./twitterApi/twitterApi');
const { createPdf } = require('./tools');

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.post('/tweets', async (req, res) => {
  const username = req.body.username;

  try {
    const user = await fetchUser({ username });

    // Check if user exists
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Get last 100 tweets
    const tweets = await fetchTweets({ userId: user.id });

    // Create PDF
    const pdfDoc = await createPdf({ tweets, user });

    // Send PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${username}_tweets.pdf"`);
    pdfDoc.pipe(res);

  } catch (error) {
    console.log(error);
    res.status(500).send('Error scraping Twitter');
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = app;