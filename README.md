# BOOKNEST - Proyek UTS DevOps (3 Container + CI/CD)

Aplikasi CRUD katalog buku fullstack: **frontend HTML/CSS/JavaScript + Nginx**, **backend Node.js 22 + Express**, **database PostgreSQL 16**. Tersedia 6 fitur: lihat, tambah, edit, hapus, cari, filter kategori.

> Catatan jujur: Proyek ini disediakan sebagai starter; **belum diuji dengan Docker di lingkungan pembuat**. Harap ikuti uji coba dan perbaiki error sebelum merekam video. Semua kata sandi contoh hanya untuk demo lokal.

## 1. Jalankan di Windows 11

Prasyarat: Docker Desktop sudah terinstal, Docker Engine aktif (Linux containers), Git (untuk push GitHub).

Buka terminal (PowerShell) **di folder yang berisi `compose.yaml`**.

```powershell
Copy-Item .env.example .env
docker compose up -d --build --wait
```

Buka **http://localhost:8080**. Periksa:

```powershell
docker compose ps
docker compose logs backend --tail 30
```

Hasil `docker compose ps` seharusnya menunjukkan **frontend, backend, db** berjalan (healthy). Tes API: http://localhost:8080/api/health dan http://localhost:8080/api/books.

Berhenti tanpa menghapus data:

```powershell
docker compose down
```

Jalankan lagi: `docker compose up -d`. Data di volume `bookstore_data` tetap ada. **Jangan** gunakan `docker compose down -v` kecuali ingin menghapus seluruh data dan mengulang database dari awal.

## 2. Pembuktian 3 container

- **frontend**: Dockerfile Nginx; menayangkan `index.html`, `styles.css`, `app.js` dan reverse proxy `/api`.
- **backend**: Dockerfile Node 22 Alpine; menginstal Express dan `pg`, menjalankan REST API.
- **db**: image PostgreSQL 16 Alpine; `database/init.sql` membuat tabel + data awal saat volume masih kosong.
- `compose.yaml`: jaringan antar-service otomatis, variabel lingkungan, port 8080, healthcheck, urutan startup, dan volume data.

Perintah demo:

```powershell
docker compose ps
docker compose exec backend node --version
docker compose exec backend npm ls --depth=0
docker compose exec frontend nginx -v
docker compose exec db psql --version
docker compose exec db psql -U bookstore -d bookstore -c "SELECT id,title,stock FROM books;"
```

## 3. Upload ke GitHub

Buat repository **PRIVATE** baru, misalnya `booknest-devops-uts`, kosong tanpa README GitHub. Di terminal folder proyek:

```powershell
git init
git add .
git commit -m "Initial BookNest fullstack container"
git branch -M main
git remote add origin https://github.com/USERNAME/booknest-devops-uts.git
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub kelompok. Saat push, GitHub Actions otomatis menjalankan job **CI** (build 3 container, tes frontend+backend+database). File workflow: `.github/workflows/ci-cd.yml`.

## 4. Agar CD otomatis sampai ke localhost Windows

Workflow sengaja **membedakan CI dan CD**. CI berjalan di mesin GitHub. CD perlu **self-hosted runner** di komputer Windows kelompok tempat Docker Desktop aktif. Tanpa runner, job CD akan berstatus **queued**. Itu **belum** berarti CD berhasil.

Di repository GitHub milik kelompok: **Settings > Actions > Runners > New self-hosted runner > Windows > x64**. Jalankan perintah **resmi yang tampil di halaman GitHub tersebut** dari PowerShell Windows pada komputer deployment. Gunakan direktori `C:\actions-runner` bila memungkinkan. Selesaikan registrasi dan jalankan runner (`run.cmd`) sampai muncul **Listening for Jobs**. Pastikan Docker Desktop sedang berjalan di komputer yang sama.

**Penting keamanan:** gunakan repo PRIVATE dan hanya izinkan anggota terpercaya push ke `main`. Self-hosted runner mengeksekusi kode dari workflow pada komputer, jadi jangan jalankan workflow dari PR pengguna tak dikenal. Untuk tugas ini lebih mudah menjalankan runner secara interaktif, bukan service, supaya bisa memakai Docker Desktop milik user.

Setelah runner online, perubahan berikutnya yang dipush ke `main` akan menjalankan CI dahulu; bila berhasil, job CD di runner Windows akan men-checkout versi terbaru, membangun ulang tiga container, dan memeriksa `http://localhost:8080/api/health`.

### Demo otomatisasi wajib

1. Catat isi judul halaman pada `frontend/index.html`.
2. Ubah teks judul atau subtitle lalu simpan.
3. `git add .` → `git commit -m "Ubah judul BookNest"` → `git push`.
4. Buka tab **GitHub > Actions**; tunjukkan **CI berhasil** kemudian **CD berhasil**.
5. Refresh `http://localhost:8080`; perubahan sudah terlihat **tanpa `docker compose up` manual setelah push**.

Bila hanya job CI yang berhasil dan CD masih queued, periksa status runner di **Settings > Actions > Runners**, label `windows`, apakah Docker Desktop aktif, dan apakah `run.cmd` masih berjalan.

## 5. Dokumentasi UTS

Gunakan `TEMPLATE_LAPORAN_BOOKSTORE.docx` yang disertakan terpisah bersama ZIP ini. Isi nama anggota, NIM, tanggal, hasil sebenarnya, screenshot dari komputer kelompok, repo GitHub, serta tautan video. Jangan tulis klaim CI/CD berhasil bila belum ada log bukti. Nama file akhir: **UTS_[NIM_PERWAKILAN].docx**.

Screenshots yang disarankan: folder proyek, browser BookNest, CRUD buku, `docker compose ps`, hasil tabel database, kode Dockerfile front/back, compose, kode workflow, log Actions CI hijau, log Actions CD hijau, runner online, browser sesudah push.

## 6. Batasan demo

- **Localhost hanya dapat diakses dari komputer tersebut** (tanpa jaringan tambahan). Ini diterima untuk demo tugas sesuai keterangan pengguna, bukan deployment server publik sungguhan.
- `.env.example` berisi password contoh. Ganti password untuk penggunaan di luar demo, gunakan pengelolaan secrets yang layak.
- Demo ini tidak memiliki login/authentication, sehingga jangan buka akses internet publik.
- Migrasi database belum diterapkan: `database/init.sql` hanya dieksekusi PostgreSQL ketika volume pertama kali dibuat.
- Jika nama container berganti akibat project lain, jalankan `docker compose ps` di folder ini untuk melihat container yang benar.

Dokumentasi: https://docs.docker.com/compose/gettingstarted/ dan https://docs.github.com/en/actions/how-tos/manage-runners/self-hosted-runners/add-runners
