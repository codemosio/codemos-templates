const fs = require('fs').promises;
const path = require('path');
const { copyDirectory, isNonEmptyDirectory } = require('./utils');

/**
 * Recursively copies a template directory and its contents to a specified destination.
 *
 * @param {string} name - The name of the template folder to copy (located within the templates directory).
 * @param {string} dest - The destination directory where the template folder will be copied to.
 * @returns {Promise<void>} A promise that resolves when the copy operation is complete.
 * @throws {Error} If the source template folder doesn't exist or if there's an error during copying.
 */
async function copyTemplate(name, dest) {
  const templatePath = path.join(__dirname, '../templates', name);
  
  // Ensure the template directory exists
  const stats = await fs.stat(templatePath);
  if (!stats.isDirectory()) {
    throw new Error(`${name} is not a valid directory.`);
  }

  // Check if destination exists and is not empty
  if (await isNonEmptyDirectory(dest)) {
    console.error(`Error: Destination directory '${dest}' already exists and is not empty.`);
    // Optionally, prompt the user to continue (or implement a CLI prompt if needed)
    // For now, we'll stop execution unless this check is acceptable.
    // You could add a flag to force overwrite here if needed
    throw new Error('Destination directory is not empty. Operation aborted to prevent overwriting.');
  }

  // Recursively copy files and folders
  await copyDirectory(templatePath, dest);
}

module.exports = {
  copyTemplate,
};
