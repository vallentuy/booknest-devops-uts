const $ = (id) => document.getElementById(id);
let books = [];
let timer;
const colors = ['#506ac9', '#3d8d88', '#a56d51', '#7b70ba', '#a65c79', '#577999'];
const rupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}
async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Permintaan gagal.');
  return data;
}
function notify(message, isError = false) {
  $('message').hidden = false;
  $('message').textContent = message;
  $('message').style.background = isError ? '#fff0f0' : '#e9f8f1';
  $('message').style.color = isError ? '#ac4050' : '#227b50';
}
function render() {
  $('totalBooks').textContent = books.length;
  $('totalStock').textContent = books.reduce((total, b) => total + b.stock, 0);
  $('totalCategories').textContent = new Set(books.map(b => b.category)).size;
  $('bookGrid').innerHTML = books.length ? books.map(book => `
    <article class="book-card">
      <div class="book-top"><div class="cover" style="background:${colors[book.id % colors.length]}">♧</div><div class="book-info"><strong>${escapeHtml(book.title)}</strong><small>${escapeHtml(book.author)}</small><span class="tag">${escapeHtml(book.category)}</span></div></div>
      <div class="book-bottom"><div><span class="price">${rupiah(book.price)}</span><span class="stock">Stok: ${book.stock} buku</span></div><div class="card-actions"><button class="mini" data-edit="${book.id}" aria-label="Edit ${escapeHtml(book.title)}">Edit</button><button class="mini delete" data-delete="${book.id}" aria-label="Hapus ${escapeHtml(book.title)}">Hapus</button></div></div>
    </article>`).join('') : '<p class="empty">Tidak ada buku yang sesuai dengan pencarian.</p>';
}
async function loadBooks() {
  const query = new URLSearchParams();
  if ($('searchInput').value.trim()) query.set('search', $('searchInput').value.trim());
  if ($('categoryFilter').value) query.set('category', $('categoryFilter').value);
  try {
    books = await request(`/api/books?${query}`);
    render();
    $('apiStatus').textContent = '● Database Terhubung';
    $('apiStatus').style.color = '#209e70';
  } catch (error) {
    $('apiStatus').textContent = '● Koneksi Gagal';
    $('apiStatus').style.color = '#ca5367';
    notify(error.message, true);
  }
}
async function loadCategories() {
  try {
    const current = $('categoryFilter').value;
    const categories = await request('/api/categories');
    $('categoryFilter').innerHTML = '<option value="">Semua kategori</option>' + categories.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('');
    $('categoryFilter').value = current;
  } catch (error) { notify(error.message, true); }
}
function openBookDialog(book = null) {
  $('bookForm').reset();
  $('bookId').value = book ? book.id : '';
  $('dialogTitle').textContent = book ? 'Edit Buku' : 'Tambah Buku';
  $('saveButton').textContent = book ? 'Simpan Perubahan' : 'Simpan Buku';
  if (book) for (const field of ['title', 'author', 'category', 'price', 'stock']) $(field).value = book[field];
  $('bookDialog').showModal();
}
$('addButton').addEventListener('click', () => openBookDialog());
$('closeDialog').addEventListener('click', () => $('bookDialog').close());
$('cancelDialog').addEventListener('click', () => $('bookDialog').close());
$('searchInput').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(loadBooks, 250); });
$('categoryFilter').addEventListener('change', loadBooks);
$('bookGrid').addEventListener('click', async event => {
  const edit = event.target.closest('[data-edit]');
  const del = event.target.closest('[data-delete]');
  if (edit) {
    const book = books.find(b => b.id === Number(edit.dataset.edit));
    if (book) openBookDialog(book);
  }
  if (del) {
    const book = books.find(b => b.id === Number(del.dataset.delete));
    if (!book || !confirm(`Hapus buku "${book.title}"?`)) return;
    try {
      await request(`/api/books/${book.id}`, { method: 'DELETE' });
      notify('Buku berhasil dihapus.');
      await loadBooks(); await loadCategories();
    } catch (error) { notify(error.message, true); }
  }
});
$('bookForm').addEventListener('submit', async event => {
  event.preventDefault();
  const id = $('bookId').value;
  const payload = Object.fromEntries(['title', 'author', 'category', 'price', 'stock'].map(k => [k, $(k).value]));
  payload.price = Number(payload.price);
  payload.stock = Number(payload.stock);
  $('saveButton').disabled = true;
  try {
    await request(id ? `/api/books/${id}` : '/api/books', { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    $('bookDialog').close();
    notify(id ? 'Buku berhasil diperbarui.' : 'Buku baru berhasil ditambahkan.');
    await loadBooks(); await loadCategories();
  } catch (error) { notify(error.message, true); }
  finally { $('saveButton').disabled = false; }
});
loadBooks(); loadCategories();
