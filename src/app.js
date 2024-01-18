const fs = require('fs');
const os = require('os');
const path = require('path');

// Get the home directory of the current user
const userHomeDir = os.homedir();

// Specify the relative path from the home directory to your executable file
const originalFilePath = path.join(userHomeDir, 'Desktop', 'GD2.1', 'GeometryDash.exe');
const newFilePath = path.join(userHomeDir, 'Desktop', 'ModifiedGeometryDash.exe');

// Create a read stream from the original file
const readStream = fs.createReadStream(originalFilePath);

// Create a write stream for the modified file
const writeStream = fs.createWriteStream(newFilePath);

// Convert the binary data to a hexadecimal string using streams
readStream.on('data', (chunk) => {
  // Convert the chunk to a hexadecimal string
  let hexData = chunk.toString('hex');

  // Specify the substrings to be replaced
  const replacements = [
    {
      searchString: '687474703A2F2F7777772E626F6F6D6C696E67732E636F6D2F64617461626173652F',
      replacementString: '687474703A2F2F6761726D696E62726F2E77696E7430722E7A6F6E652F616161612F'
    },
    {
      searchString: '6148523063446F764C336433647935696232397462476C755A334D75593239744C3252686447466959584E6C',
      replacementString: '6148523063446F764C326468636D3170626D4A7962793533615735304D484975656D39755A53396859574668'
    }
  ];

  // Perform replacements
  replacements.forEach(({ searchString, replacementString }) => {
    hexData = hexData.replace(new RegExp(searchString, 'gi'), replacementString);
  });

  // Convert the modified hexadecimal string back to binary data
  const modifiedData = Buffer.from(hexData, 'hex');

  // Write the modified data to the new file stream
  writeStream.write(modifiedData);
});

// End the write stream when the read stream ends
readStream.on('end', () => {
  writeStream.end();
  console.log(`Data with replacements written to ${newFilePath}`);
});

// Handle errors
readStream.on('error', (error) => {
  console.error(error);
});

writeStream.on('error', (error) => {
  console.error(error);
});
