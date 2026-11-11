# Pembagian tugas 5 orang dan skenario video UTS

## Deadline Kamis, 12 November 2026

Fokus utama: aplikasi berjalan dulu, tiga container sehat, lalu CI/CD otomatis; dokumentasikan hasil nyata.

### Hari 1 — Selasa malam 10/11 dan Rabu pagi 11/11
1. Anggota A: instal Docker Desktop, jalankan `docker compose up -d --build --wait`, uji frontend + fitur CRUD. Ambil tangkapan layar.
2. Anggota B: pelajari `backend/server.js` dan endpoint API; uji `/api/health`, `/api/books`; ambil screenshot kode dan respons.
3. Anggota C: pelajari `database/init.sql`, volume `bookstore_data`, dan uji `SELECT ... FROM books` di PostgreSQL.
4. Anggota D: pelajari `compose.yaml`, dua Dockerfile, Nginx reverse proxy; cek `docker compose ps` menampilkan tiga container healthy.
5. Anggota E: buat repo private GitHub, upload, cek CI GitHub Actions, instal self-hosted runner Windows, uji CD.

### Hari 2 — Rabu siang/malam 11/11
- Semua latihan menjelaskan bagian masing-masing, perbaiki bug jika ada, lakukan demo push perubahan nyata, kumpulkan screenshot, rekam video open camera.
- Penyusun laporan mengisi identitas + versi asli dari perintah docker/npm, repository, semua screenshot, sumber kode/AI, tautan video.

### Kamis 12/11 — sebelum deadline
- Cek ulang links dapat diakses dosen, video tidak private yang tidak bisa dibuka, jalankan aplikasi, file Word `UTS_[NIM_PERWAKILAN].docx` terbuka rapi, lalu unggah.

## Script demo yang disarankan: satu video 12-14 menit

| Perkiraan durasi | Anggota | Topik utama | Wajib tunjukkan |
|---|---|---|---|
| 0:00-2:10 | A | Tujuan app, fitur dan frontend, bagaimana user mengakses deployment | Browser, CRUD, `frontend/Dockerfile`, Nginx |
| 2:10-4:20 | B | Backend Node dan API, alur request frontend -> backend -> DB | `backend/Dockerfile`, `server.js`, endpoint `/api/health` |
| 4:20-6:15 | C | Database PostgreSQL, inisialisasi SQL, menyimpan data | `database/init.sql`, SQL SELECT, volume |
| 6:15-8:20 | D | Docker Compose sebagai penghubung tiga container, startup, network dan port | `compose.yaml`, `docker compose ps` |
| 8:20-12:45 | E | Git commit/push -> CI GitHub Actions -> CD runner lokal -> perubahan terlihat | `.github/workflows/ci-cd.yml`, GitHub Actions hijau, browser berubah |
| 12:45-13:30 | Semua | Kesimpulan singkat: bagaimana bagian masing-masing ikut dalam alur deploy | Tampilan aplikasi dan nama kelompok |

Semua tampil dengan kamera aktif ketika berbicara. Pastikan anggota yang menjelaskan frontend/backend/database juga menjelaskan hubungan bagiannya dalam proses deployment, bukan hanya fitur. Untuk kebutuhan laporan 2 tautan video, bisa menggunakan **dua video** (container dan CI/CD) atau satu video dengan tautan timestamp berbeda, bila dosen mengizinkan.

## Perintah perekaman yang penting

```powershell
# Dari folder proyek
Copy-Item .env.example .env  # hanya sekali jika belum ada

docker compose up -d --build --wait
docker compose ps
docker compose logs backend --tail 20
docker compose exec db psql -U bookstore -d bookstore -c "SELECT id,title,stock FROM books;"

# Demo CI/CD: UBAH TEKS DI frontend/index.html, lalu:
git add .
git commit -m "Demo update halaman BookNest"
git push
```

Setelah push, **jangan** menjalankan `docker compose up` manual; tunggu job CI/CD di GitHub hijau, baru refresh browser untuk membuktikan otomatisasi. Pada kondisi nyata, laptop target harus aktif dan runner terhubung.

## Pertanyaan yang mungkin diajukan dosen

**Mengapa 3 container?** Setiap komponen punya tugas berbeda dan bisa dibangun/diubah tanpa mencampurkan dependensinya.

**Mengapa Nginx?** Melayani halaman statis sekaligus meneruskan `/api/` ke container backend melalui nama service `backend`.

**Mengapa volume?** Agar data buku tidak hilang ketika container database direkreasi. Data hilang jika volume sengaja dihapus dengan `down -v`.

**Apa perbedaan CI dan CD?** CI memvalidasi perubahan (syntax/build/test), sedangkan CD menyebarkan perubahan yang lolos ke komputer deployment.

**Bagaimana GitHub bisa mengakses localhost laptop?** GitHub sendiri tidak mengakses localhost secara langsung. Self-hosted runner dipasang di laptop dan menerima job dari GitHub Actions, lalu menjalankan Docker di komputer itu.

**Apa bukti CD benar-benar otomatis?** Push commit lalu GitHub Actions menunjukkan urutan job CI dan CD sukses, disusul perubahan UI yang muncul tanpa deploy manual.

**Apakah localhost sama dengan production publik?** Tidak. Untuk tugas ini localhost diterima sebagai target deployment/demo menurut informasi yang diterima. Ini bukan hosting yang tersedia untuk publik.

## Kesalahan yang perlu dihindari

- Tidak bisa menunjukan ketiga container berjalan.
- Menganggap hanya workflow CI berwarna hijau sudah berarti CD berhasil; `deploy` juga harus sukses.
- Mengaku otomatis padahal setelah `git push` masih mengetik `docker compose up` manual.
- Berbohong tentang hasil tes atau menyamakan preview UI dengan tes di Docker.
- Memasukkan password `.env` atau token runner ke GitHub/screenshot.
- Mengubah file `database/init.sql` dan berharap tabel lama berubah otomatis; init hanya pada volume baru.
