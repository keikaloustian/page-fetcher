const request = require('request');
const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const url = process.argv[2];
const filePath = process.argv[3];

if (!url) {
  console.log('URL is invalid');
  process.exit();
}

if (!filePath) {
  console.log('File path is invalid');
  process.exit();
}

request(url, (error, response, body) => {

  if (error) {
    // Print the error and status code if one occurred
    console.log('Network error: ', error);
    console.log('Response:', response);
    process.exit();
  }
  
  fs.access(filePath, (error) => {
    if (error) {
      // If file doesn't exist yet, write (create) it
      fs.writeFile(filePath, body, err => {
        
        if (err) {
          console.log('File writing error: ', err);
          
        } else {
          console.log(`Downloaded and saved ${body.length} bytes to ${filePath}`);
        }
        
      });

    } else {
      // If file already exists, ask for user input
      rl.question('File already exists. Y + Enter to overwrite ', (answer) => {
        if (answer === 'Y') {
          fs.writeFile(filePath, body, err => {
            if (err) {
              console.log('File writing error: ', err);
              
            } else {
              console.log(`Downloaded and saved ${body.length} bytes to ${filePath}`);
            }
          });
        } else {
          process.exit();
        }
      
        rl.close();
      });

    }

  });

});




