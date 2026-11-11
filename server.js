const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml; charset=UTF-8',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Resolve file path
  let relativePath = urlPath;
  if (relativePath === '/' || relativePath === '') {
    relativePath = '/index.html';
  }

  // Handle nested asset requests (e.g. /apply/css/styles.css -> /css/styles.css)
  if (relativePath.includes('/css/')) {
    relativePath = relativePath.slice(relativePath.indexOf('/css/'));
  } else if (relativePath.includes('/js/')) {
    relativePath = relativePath.slice(relativePath.indexOf('/js/'));
  } else if (relativePath.includes('/assets/')) {
    relativePath = relativePath.slice(relativePath.indexOf('/assets/'));
  }

  let filePath = path.join(__dirname, relativePath);
  let ext = path.extname(filePath).toLowerCase();

  // If no extension, try appending .html
  if (!ext) {
    filePath += '.html';
    ext = '.html';
  }

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': mime,
        'Content-Length': stats.size,
        'Cache-Control': 'no-cache'
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // For missing static assets (.css, .js, .png, etc.), return 404, NOT HTML fallback
    if (ext !== '.html') {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`404 Not Found: ${urlPath}`);
      return;
    }

    // For HTML routes fallback to index.html (SPA)
    const indexPath = path.join(__dirname, 'index.html');
    fs.readFile(indexPath, (fallbackErr, content) => {
      if (fallbackErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://localhost:${PORT}/ and http://127.0.0.1:${PORT}/`);
});
