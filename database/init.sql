CREATE TABLE IF NOT EXISTS books (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(160) NOT NULL,
    author VARCHAR(120) NOT NULL,
    category VARCHAR(70) NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    stock INTEGER NOT NULL CHECK (stock >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO books (title, author, category, price, stock) VALUES
('Atomic Habits', 'James Clear', 'Pengembangan Diri', 115000, 12),
('Filosofi Teras', 'Henry Manampiring', 'Pengembangan Diri', 98000, 8),
('Laut Bercerita', 'Leila S. Chudori', 'Novel', 105000, 7),
('Bumi', 'Tere Liye', 'Novel', 89000, 15),
('Clean Code', 'Robert C. Martin', 'Teknologi', 225000, 5),
('Dasar Pemrograman Python', 'Tim Bookstore', 'Teknologi', 76000, 20);
