-- 1. Semua buku
SELECT id, title, author, category, price, stock
FROM books
ORDER BY id;

-- 2. Stok rendah (< 10)
SELECT title, stock
FROM books
WHERE stock < 10
ORDER BY stock;

-- 3. Jumlah judul berdasarkan kategori
SELECT category, COUNT(*) AS jumlah_judul
FROM books
GROUP BY category
ORDER BY category;

-- 4. Total stok
SELECT COALESCE(SUM(stock), 0) AS total_stok
FROM books;