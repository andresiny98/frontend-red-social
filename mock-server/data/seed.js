const users = [
  {
    id: 1,
    username: 'jperez',
    password: '123456',
    firstName: 'Juan',
    lastName: 'Pérez',
    birthDate: '1995-03-12',
    alias: 'jp_dev',
  },
  {
    id: 2,
    username: 'mgomez',
    password: '123456',
    firstName: 'María',
    lastName: 'Gómez',
    birthDate: '1998-07-22',
    alias: 'maggo',
  },
  {
    id: 3,
    username: 'clopez',
    password: '123456',
    firstName: 'Carlos',
    lastName: 'López',
    birthDate: '1990-11-05',
    alias: 'carlitos',
  },
];

const posts = [
  {
    id: 1,
    message: 'Arrancando esta red social, ¡bienvenidos!',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    userId: 1,
    likedBy: new Set([2, 3]),
  },
  {
    id: 2,
    message: 'Probando la publicación de likes en tiempo real.',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    userId: 2,
    likedBy: new Set([1]),
  },
];

module.exports = { users, posts };
