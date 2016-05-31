const proxy = require('http-proxy');

const args = process.argv.slice(2);
const port = args[0];

if (!port) {
  console.log('Usage: rootProxy.js [port]');
} else {
  const options = {
    target: `http://localhost:${port}`,
    ws: true,
    xfwd: true,
  };
  proxy.createProxyServer(options).listen(80);
  proxy.createProxyServer(options).listen(443);
  console.log('Root Proxy Started');
}
