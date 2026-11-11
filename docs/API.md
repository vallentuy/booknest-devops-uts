# Dokumentasi Backend BookNest

Backend menggunakan Node.js, Express, dan PostgreSQL.

## Endpoint API
- GET /api/health — Cek koneksi database
- GET /api/books — Menampilkan daftar buku
- POST /api/books — Menambahkan buku
- PUT /api/books/:id — Mengubah buku
- DELETE /api/books/:id — Menghapus buku

## Hasil Pengujian
- /api/health: Berhasil, database connected
- /api/books: Berhasil menampilkan 6 buku   