function generateReport(name, scores) {
  if (!Array.isArray(scores)) scores = [];
  const sum = scores.reduce((a, b) => a + b, 0);
  const avg = scores.length ? sum / scores.length : 0;
  const status = avg >= 10 ? 'Pass' : 'Fail';
  return `Report for ${name}\nAverage: ${avg.toFixed(2)}\nStatus: ${status}`;
}

module.exports = { generateReport };
