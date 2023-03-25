const PDFDocument = require('pdfkit');
const axios = require('axios');
const moment = require('moment');

const dateFormat = 'YYYY MM DD, h:mm:ss';

/**
 * Create PDF from tweets
 *
 * @param {Object} twitterApi
 * @param {Object[]} tweets
 * @param {Object} user
 * @returns {Object} pdf
 */
module.exports.createPdf = async ({ tweets, user }) => {
  const doc = new PDFDocument();

  // Get the author's avatar image
  const avatarResponse = await axios.get(user.profile_image_url, { responseType: 'arraybuffer' });
  const avatarBuffer = Buffer.from(avatarResponse.data, 'binary');

  tweets.forEach(async (tweet) => {
    const date = moment(tweet.created_at).format(dateFormat);

    // Add avatar image
    doc.image(avatarBuffer, { width: 25, height: 25 });
    // Add user name and username
    doc.text(`${user.name} (@${user.username})`, { indent: 30 });
    doc.moveDown(0.5);

    // Add date
    doc.text(date, { indent: 30 });
    doc.moveDown(0.5);

    // Add tweet text
    doc.text(tweet.text, { indent: 30 });
    doc.moveDown(0.5);

    // Add tweet image
    if (tweet.entities?.media && tweet.entities.media.length > 0) {
      const media = tweet.entities.media[0];

      const pictureResponse = await axios.get(media.media_url_https, { responseType: 'arraybuffer' });
      const pictureBuffer = Buffer.from(pictureResponse.data, 'binary');

      doc.image(pictureBuffer, { width: media.sizes.medium.w, height: media.sizes.medium.h });
      doc.moveDown(0.5);
    }

    // Add tweet stats
    doc.text(
      `${tweet.public_metrics.like_count} likes, ${tweet.public_metrics.retweet_count} retweets, ${tweet.public_metrics.reply_count} replies`,
      { indent: 30 }
    );
    doc.moveDown(1);
  });

  doc.end();

  return doc;
}
