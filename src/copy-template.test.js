const fs = require('fs');
const path = require('path');
const { isNonEmptyDirectory } = require('./utils');
const { copyTemplate, copyDirectory } = require('./copy-template');

// Declare mock for the fs module
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    readdir: jest.fn(),
    copyFile: jest.fn(),
    stat: jest.fn(),
  },
}));

// Declare mock for the utils module
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'), // Preserve other functions in utils if needed
  // copyDirectory: jest.fn(), // like this one
  isNonEmptyDirectory: jest.fn(),
}));

describe('copyTemplate', () => {
  it('should throw an error if the template folder does not exist', async () => {
    // Mock stat to simulate the ENOENT error for non-existing directory
    fs.promises.stat.mockResolvedValueOnce({ isDirectory: () => false });
  
    // Test if the proper error is thrown when the template doesn't exist
    await expect(copyTemplate('nonexistent-template', './dest'))
      .rejects
      .toThrow('nonexistent-template is not a valid directory.');
  });

  it('should copy a template folder to the destination', async () => {
    // Mock stat to simulate the existing directory
    fs.promises.stat.mockResolvedValueOnce({ isDirectory: () => true });
    // Mock isNonEmptyDirectory to simulate an empty destination directory
    isNonEmptyDirectory.mockResolvedValueOnce(false);
    // Mock readdir to simulate the contents of the template folder with directory entry objects
    fs.promises.readdir.mockResolvedValueOnce([
      { name: 'file1.md', isDirectory: () => false },
      { name: 'file2.md', isDirectory: () => false }
    ]);
    // Mock copyFile to simulate copying files
    fs.promises.copyFile.mockResolvedValue();

    // Call the function to copy the template
    await copyTemplate('../templates/codemos', './dest');

    // Validate the expected calls were made
    expect(fs.promises.mkdir).toHaveBeenCalledWith('./dest', { recursive: true });
    expect(fs.promises.copyFile).toHaveBeenCalledTimes(2);
  });
});
