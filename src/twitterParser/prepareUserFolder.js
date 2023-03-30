const fs = require('fs');
const path = require('path');

/**
 * Create folder for user if it doesn't exist
 * @param {string} username
 */
module.exports = function prepareUserFolder(username) {
  const dataFolderPath = path.join(__dirname, '../../data');
  const userFolderPath = path.join(dataFolderPath, username);

  // check folder: /data
  if (!fs.existsSync(dataFolderPath)) {
    fs.mkdirSync(dataFolderPath);
  }
  // check folder: /data/username
  if (!fs.existsSync(userFolderPath)) {
    fs.mkdirSync(userFolderPath);
  }
}
