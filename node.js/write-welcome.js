const fs = require('fs');

fs.writeFileSync('welcome.txt', 'Hello Node\n', 'utf8');
console.log('welcome.txt created');
