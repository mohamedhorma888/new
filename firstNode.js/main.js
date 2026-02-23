const { generateReport } = require('./reportGenerator');

const report = generateReport('Alice', [12, 15, 9]);
console.log(report);
