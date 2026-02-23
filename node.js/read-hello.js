const fs = require('fs');

fs.readFile('hello.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading hello.txt:', err.message);
    return;
  }
  console.log(data);
});
