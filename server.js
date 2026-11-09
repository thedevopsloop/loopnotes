// LoopNotes — a tiny notes app with zero dependencies.
// Run it:  node server.js   then open http://localhost:3000
// Settings come from environment variables (we'll use these a lot later in the course).
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 3000);
const DATA_FILE = process.env.DATA_FILE || path.join(__dirname, 'data', 'notes.json');
const APP_ENV = process.env.APP_ENV || 'dev'; // dev | staging | production (Ep 8)

function loadNotes() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { return [{ id: 1, text: 'Learn Linux', done: true }, { id: 2, text: 'Push to GitHub', done: false }, { id: 3, text: 'Ship it to the cloud', done: false }]; }
}
function saveNotes(notes) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}
function send(res, status, body, type = 'application/json') {
  res.writeHead(status, { 'Content-Type': type });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 1e5) req.destroy(); });
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); } });
  });
}

let notes = loadNotes();

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const started = Date.now();
  res.on('finish', () => console.log(`${new Date().toISOString()} ${req.method} ${url.pathname} ${res.statusCode} ${Date.now() - started}ms`));
  try {
    if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { status: 'ok', env: APP_ENV });
    if (req.method === 'GET' && url.pathname === '/api/notes') return send(res, 200, notes);
    if (req.method === 'POST' && url.pathname === '/api/notes') {
      const { text } = await readBody(req);
      if (!text || typeof text !== 'string') return send(res, 400, { error: 'text is required' });
      const note = { id: Date.now(), text: text.slice(0, 200), done: false };
      notes.push(note); saveNotes(notes);
      return send(res, 201, note);
    }
    const m = url.pathname.match(/^\/api\/notes\/(\d+)$/);
    if (m && req.method === 'PATCH') {
      const note = notes.find((n) => n.id === Number(m[1]));
      if (!note) return send(res, 404, { error: 'not found' });
      note.done = !note.done; saveNotes(notes);
      return send(res, 200, note);
    }
    if (m && req.method === 'DELETE') {
      notes = notes.filter((n) => n.id !== Number(m[1])); saveNotes(notes);
      return send(res, 204, '', 'text/plain');
    }
    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      return send(res, 200, fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8'), 'text/html; charset=utf-8');
    }
    send(res, 404, { error: 'not found' });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: 'server error' });
  }
});

server.listen(PORT, () => console.log(`LoopNotes (${APP_ENV}) listening on http://localhost:${PORT}`));
process.on('SIGTERM', () => server.close(() => process.exit(0))); // clean shutdown (matters in Docker/K8s)
