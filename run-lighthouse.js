const { exec } = require('child_process');
const fs = require('fs');

const url = 'https://www.reddit.com'; // Change this if needed
const threshold = 80; // Performance score threshold

exec(`lighthouse ${url} --output json --output-path ./report.json`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing Lighthouse: ${error}`);
    return;
  }

  const report = JSON.parse(fs.readFileSync('./report.json', 'utf8'));
  const performanceScore = report.categories.performance.score * 100;

  if (performanceScore < threshold) {
    console.error(`Performance score ${performanceScore} is below the threshold of ${threshold}`);
    process.exit(1); // Indicate failure
  } else {
    console.log(`Performance score ${performanceScore} is above the threshold of ${threshold}`);
  }
});
