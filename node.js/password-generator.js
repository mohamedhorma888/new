const generator = require('generate-password');

function genPassword() {
  const password = generator.generate({
    length: 12,
    numbers: true,
    symbols: true,
    uppercase: true,
    lowercase: true,
  });
  console.log(password);
}

genPassword();
