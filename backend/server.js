'use strict';
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '32kb' }));
const pool = new Pool();

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
}

function parseBook(data) {
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const author = typeof data.author === 'string' ? data.author.trim() : '';
  const category = typeof data.category === 'string' ? data.category.trim() : '';
  const price = Number(data.price);
  const stock = Number(data.stock);
  if (!title || title.length > 160 || !author || author.length > 120 || !category || category.length > 70 ||
    data.price === '' || data.price === undefined || !Number.isSafeInteger(price) || price < 0 ||
    data.stock === '' || data.stock === undefined || !Number.isSafeInteger(stock) || stock < 0) {
    return null;
  }
  return { title, author, category, price, stock };
}

function validId(raw) {
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 && id <= 2147483647 ? id : null;
}

app.get('/api/health', asyncRoute(async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'ok', service: 'bookstore-api', database: 'connected' });
}));

app.get('/api/categories', asyncRoute(async (_req, res) => {
  const result = await pool.query('SELECT DISTINCT category FROM books ORDER BY category');
  res.json(result.rows.map(row => row.category));
}));

app.get('/api/books', asyncRoute(async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
  const category = typeof req.query.category === 'string' ? req.query.category.trim() : '';
  const params = [];
  const where = [];
  if (search) {
    params.push(`%${search}%`);
    where.push(`(title ILIKE $${params.length} OR author ILIKE $${params.length})`);
  }
  if (category) {
    params.push(category);
    where.push(`category = $${params.length}`);
  }
  const sql = `SELECT id, title, author, category, price, stock FROM books ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY id DESC`;
  const result = await pool.query(sql, params);
  res.json(result.rows);
}));

app.post('/api/books', asyncRoute(async (req, res) => {
  const book = parseBook(req.body || {});
  if (!book) return res.status(400).json({ error: 'Isi judul, penulis, kategori, harga, dan stok dengan benar.' });
  const result = await pool.query(
    'INSERT INTO books (title, author, category, price, stock) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, author, category, price, stock',
    [book.title, book.author, book.category, book.price, book.stock]
  );
  res.status(201).json(result.rows[0]);
}));

app.put('/api/books/:id', asyncRoute(async (req, res) => {
  const id = validId(req.params.id);
  const book = parseBook(req.body || {});
  if (!id || !book) return res.status(400).json({ error: 'ID atau data buku tidak valid.' });
  const result = await pool.query(
    'UPDATE books SET title=$1, author=$2, category=$3, price=$4, stock=$5 WHERE id=$6 RETURNING id, title, author, category, price, stock',
    [book.title, book.author, book.category, book.price, book.stock, id]
  );
  if (!result.rowCount) return res.status(404).json({ error: 'Buku tidak ditemukan.' });
  res.json(result.rows[0]);
}));

app.delete('/api/books/:id', asyncRoute(async (req, res) => {
  const id = validId(req.params.id);
  if (!id) return res.status(400).json({ error: 'ID tidak valid.' });
  const result = await pool.query('DELETE FROM books WHERE id=$1 RETURNING id', [id]);
  if (!result.rowCount) return res.status(404).json({ error: 'Buku tidak ditemukan.' });
  res.json({ message: 'Buku berhasil dihapus.', id });
}));

app.use('/api', (_req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan.' }));
app.use((err, _req, res, _next) => {
  console.error('API error:', err.message);
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Format JSON tidak valid.' });
  res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => console.log(`Bookstore API listening on ${port}`));
