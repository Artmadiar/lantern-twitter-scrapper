const PDFDocument = require('pdfkit');

/**
 * Create PDF from tweets
 *
 * @param {Object} twitterApi
 * @param {Object[]} tweets
 * @returns 
 */
module.exports.createPdf = ({ tweets, username }) => {
  const pdfDoc = new PDFDocument();

  pdfDoc.fontSize(18).text(`${username}\n\n`, { lineHeight: 3 });

  tweets.forEach(tweet => {
    pdfDoc.fontSize(14).text(`${tweet.text}\n\n`, { lineHeight: 1.5 });
  });

  pdfDoc.end();
  return pdfDoc;
}
