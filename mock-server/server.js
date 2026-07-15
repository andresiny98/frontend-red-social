const express = require('express');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');
const { WebSocketServer } = require('ws');
const { users, posts } = require('./data/seed');

const JWT_SECRET = 'mock-secret-red-social';
const PORT = 3000;
const CLIENT_ORIGIN = 'http://localhost:4200';

let nextPostId = posts.length + 1;

const app = express();
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

function broadcast(type, payload) {
  const message = JSON.stringify({ type, payload });
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

function toPublicUser(user) {
  const { password, ...publicUser } = user;
  return publicUser;
}

function toPublicPost(post, requesterId) {
  const author = users.find((u) => u.id === post.userId);
  return {
    id: post.id,
    message: post.message,
    publishedAt: post.publishedAt,
    author: author ? { id: author.id, username: author.username, alias: author.alias } : null,
    likesCount: post.likedBy.size,
    likedByMe: post.likedBy.has(requesterId),
  };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u.id === payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Usuario o clave incorrectos' });
  }
  const token = jwt.sign({ sub: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '8h',
  });
  res.json({ token, user: toPublicUser(user) });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json(toPublicUser(req.user));
});

app.get('/api/posts', authMiddleware, (req, res) => {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  res.json(sorted.map((p) => toPublicPost(p, req.user.id)));
});

app.post('/api/posts', authMiddleware, (req, res) => {
  const { message } = req.body || {};
  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'El mensaje es requerido' });
  }
  const post = {
    id: nextPostId++,
    message: message.trim(),
    publishedAt: new Date().toISOString(),
    userId: req.user.id,
    likedBy: new Set(),
  };
  posts.push(post);
  res.status(201).json(toPublicPost(post, req.user.id));
});

app.post('/api/posts/:id/like', authMiddleware, (req, res) => {
  const postId = Number(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    return res.status(404).json({ message: 'Publicación no encontrada' });
  }
  if (post.likedBy.has(req.user.id)) {
    post.likedBy.delete(req.user.id);
  } else {
    post.likedBy.add(req.user.id);
  }
  broadcast('post:like', {
    postId: post.id,
    likesCount: post.likedBy.size,
    likedBy: [...post.likedBy],
  });
  res.json(toPublicPost(post, req.user.id));
});

wss.on('connection', (socket, req) => {
  const token = new URL(req.url, `http://${req.headers.host}`).searchParams.get('token');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    console.log(`[ws] conectado: usuario ${payload.username}`);
  } catch {
    console.log('[ws] conectado sin token válido');
  }

  socket.on('close', () => {
    console.log('[ws] desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`Mock server escuchando en http://localhost:${PORT}`);
});
