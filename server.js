// Static server for the FleetFlow build in ./dist.
// Serves files as-is and falls back to index.html so client-side routes
// (/shipments, /tracking, ...) work on reload and direct links.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "dist");
const PORT = Number(process.env.PORT) || 3000;
const INDEX = path.join(ROOT, "index.html");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};

function send(res, file, status = 200) {
  const ext = path.extname(file);
  const hashed = file.startsWith(path.join(ROOT, "assets") + path.sep);
  res.writeHead(status, {
    "Content-Type": TYPES[ext] || "application/octet-stream",
    "Cache-Control": hashed ? "public, max-age=31536000, immutable" : "no-cache",
    "X-Robots-Tag": "noindex, nofollow",
    "X-Content-Type-Options": "nosniff",
  });
  fs.createReadStream(file).pipe(res);
}

http
  .createServer((req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, "http://x").pathname);
    } catch {
      res.writeHead(400).end();
      return;
    }
    const file = path.normalize(path.join(ROOT, pathname));
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) {
      res.writeHead(403).end();
      return;
    }
    fs.stat(file, (err, stat) => {
      if (!err && stat.isFile()) return send(res, file);
      // Missing files under /assets are real 404s; everything else is an app route.
      if (pathname.startsWith("/assets/")) {
        res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
        return;
      }
      send(res, INDEX);
    });
  })
  .listen(PORT, "0.0.0.0", () => {
    console.log(`FleetFlow listening on port ${PORT}`);
  });
