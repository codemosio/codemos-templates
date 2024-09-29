const fs = require('fs').promises;
const path = require('path');

/**
 * Recursively copies the contents of one directory to another.
 *
 * @param {string} src - The source directory to copy.
 * @param {string} dest - The destination directory where the files will be copied to.
 * @returns {Promise<void>} A promise that resolves when the copy operation is complete.
 */
async function copyDirectory(src, dest) {
  // Ensure the destination directory exists
  await fs.mkdir(dest, { recursive: true });
  
  // Read all items (files/folders) in the source directory
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively copy subdirectory
      await copyDirectory(srcPath, destPath);
    } else {
      // Copy file
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Checks if a directory exists and is not empty.
 *
 * @param {string} dir - The path to the directory to check.
 * @returns {Promise<boolean>} A promise that resolves to true if the directory exists and is not empty, false otherwise.
 */
async function isNonEmptyDirectory(dir) {
  try {
    const files = await fs.readdir(dir);
    return files.length > 0;
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Directory does not exist
      return false;
    }
    throw error;  // Propagate other errors
  }
}

module.exports = {
  copyDirectory,
  isNonEmptyDirectory
};