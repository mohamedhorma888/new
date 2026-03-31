import http from 'http';

function httpGet(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: 4000, path, timeout: 2000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function runTests() {
  try {
    const res = await httpGet('/health');
    if (res.statusCode === 200 && res.body.status === 'ok') {
      console.log('✅ Health check passed');
      process.exit(0);
    }
    console.error('❌ Health check failed', res);
    process.exit(1);
  } catch (err) {
    console.error('❌ Health check unreachable, please run backend first: npm run dev');
    process.exit(1);
  }
}

runTests();
