const proxy = require('http-proxy');

function rootProxy(port) {
  const options = {
    target: `http://localhost:${port}`,
    ws: true,
    xfwd: true,
  };
  const server = proxy.createProxyServer(options).listen(80);
  return server;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const port = args[0];
  rootProxy(port);
  console.log('Root Proxy Started');
}

module.exports = rootProxy;
