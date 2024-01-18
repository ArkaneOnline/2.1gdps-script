const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');
const EventEmitter = require('events');
const console = require('console');

const eventEmitter = new EventEmitter();

// Get the home directory of the current user
const userHomeDir = os.homedir();


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Locate your 2.1 "GeometryDash.exe" file downloaded from Steam, drag and drop the "GeometryDash.exe" file onto this CMD window, then press "Enter": ', (filePath) => {
  // Process the file path
  console.log('File path:', filePath);
  var gdpsPath = filePath.toString();

  // Close the readline interface
  rl.close();
  eventEmitter.emit("filePathFound", gdpsPath);
});

eventEmitter.on('filePathFound', gdpsPath => {
  // Specify the relative path from the home directory to your executable file
  const originalFilePath = gdpsPath;
  const dirName = path.dirname(gdpsPath);
  const newFilePath = path.join(dirName, "PointercrateGDPS.exe");

  console.log(dirName);
  console.log(newFilePath);
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
    fs.renameSync(newFilePath, path.join(dirName, "PointercrateGDPS.exe"));
    fs.writeFileSync(`${path.join(dirName, "steam_appid.txt")}`, "322170");
    fs.unlinkSync(originalFilePath);
    console.clear();
    console.log('Successfully installed the Pointercrate 2.1 GDPS. Launch the GDPS with "PointercrateGDPS.exe" inside your 2.1 folder!');
    setTimeout(() => {
      return;
    }, 10000);
  });

  // Handle errors
  readStream.on('error', (error) => {
    console.error(error);
  });

  writeStream.on('error', (error) => {
    console.error(error);
  });


});