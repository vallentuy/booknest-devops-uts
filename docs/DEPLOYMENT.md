
# Panduan Deployment Docker BookNest

## 1. Tujuan

Dokumen ini menjelaskan langkah-langkah menjalankan aplikasi BookNest menggunakan Docker Compose. Panduan ini dibuat agar anggota kelompok dapat melakukan deployment aplikasi secara mandiri serta memahami hubungan antara frontend, backend, dan database dalam tiga container Docker.

## 2. Prasyarat

Sebelum menjalankan aplikasi, pastikan perangkat telah memiliki:

- Docker Desktop yang sudah terinstal dan berjalan.
- Docker Compose yang tersedia.
- Repository BookNest sudah diunduh ke komputer.
- Terminal PowerShell atau terminal lainnya.
- File `compose.yaml` tersedia di folder utama proyek.

Seluruh perintah deployment dijalankan dari folder utama repository BookNest.

## 3. Arsitektur 3 Container

Aplikasi BookNest menggunakan tiga container utama yang saling terhubung.

| Container | Image | Fungsi |
|---|---|---|
| Frontend | nginx:stable-alpine | Menampilkan halaman website dan meneruskan request API melalui reverse proxy. |
| Backend | node:22-alpine | Menjalankan REST API menggunakan Node.js dan Express pada port 3000. |
| Database | postgres:16-alpine3.23 | Menyimpan data aplikasi menggunakan PostgreSQL. |

Hubungan antarcontainer:

- Frontend menerima permintaan pengguna melalui port 8080 pada komputer dan meneruskannya ke port 80 di container.
- Backend menjalankan API pada port 3000.
- Database menggunakan port internal 5432.
- Backend terhubung ke database melalui nama service `db` menggunakan konfigurasi `PGHOST=db`.
- Frontend menunggu backend dalam kondisi sehat sebelum dijalankan.
- Backend menunggu database dalam kondisi sehat sebelum dijalankan.

Alur deployment:

Source code → Dockerfile membangun image → Docker Compose membuat tiga container → Frontend menerima request dari browser → Backend memproses request dan mengakses PostgreSQL.

## 4. Konfigurasi .env

File `.env.example` digunakan sebagai template konfigurasi lingkungan aplikasi.

Konfigurasi yang tersedia:

```env
POSTGRES_PASSWORD=local_demo_only_change_me
```

Apabila file `.env` belum tersedia, buat salinan dari template menggunakan perintah PowerShell:

```powershell
Copy-Item .env.example .env
```

Variabel `POSTGRES_PASSWORD` digunakan untuk mengatur password database PostgreSQL.

Password contoh tersebut hanya untuk kebutuhan demo lokal dan tidak boleh digunakan pada server publik.

File `.env` digunakan secara lokal dan tidak boleh membagikan password atau informasi rahasia ke repository publik.

## 5. Menjalankan Aplikasi

Pastikan Docker Desktop sudah berjalan dan terminal berada di folder utama proyek yang memiliki file `compose.yaml`.

Jalankan perintah berikut untuk membangun image dan menjalankan seluruh container:

```powershell
docker compose up -d --build --wait
```

Keterangan:

- `up` menjalankan layanan Docker Compose.
- `-d` menjalankan container di background.
- `--build` membangun ulang image berdasarkan Dockerfile.
- `--wait` menunggu layanan mencapai kondisi berjalan atau sehat.

## 6. Cek Status Container

Untuk melihat status seluruh container, jalankan:

```powershell
docker compose ps
```

Perintah tersebut digunakan untuk memeriksa status layanan frontend, backend, dan database.

Pastikan ketiga layanan berjalan dengan kondisi sehat sebelum aplikasi digunakan.

## 7. Akses Browser

Setelah seluruh container berjalan dengan baik, buka browser dan akses alamat berikut:

http://localhost:8080

Alamat tersebut digunakan untuk membuka halaman frontend BookNest melalui web server Nginx.

## 8. Health Check API

Untuk memastikan backend dapat diakses melalui frontend, jalankan perintah berikut pada PowerShell:

```powershell
curl.exe http://localhost:8080/api/health
```

Perintah tersebut digunakan untuk memeriksa endpoint kesehatan API BookNest.

Apabila API memberikan respons dengan baik, berarti jalur komunikasi dari frontend menuju backend dapat berfungsi.

## 9. Penghentian Aplikasi

Jika aplikasi sudah selesai digunakan, hentikan seluruh layanan menggunakan perintah:

```powershell
docker compose down
```

Perintah tersebut menghentikan dan menghapus container serta jaringan yang dibuat oleh Docker Compose.

**Penting:** Jangan menggunakan perintah `docker compose down -v` karena opsi `-v` dapat menghapus named volume dan menyebabkan data database hilang.

## 10. Peran Volume Database

Docker Compose menggunakan named volume bernama `bookstore_data` untuk menyimpan data PostgreSQL.

Volume tersebut dipasang pada direktori:

`/var/lib/postgresql/data`

Fungsi volume adalah menjaga agar data database tetap tersimpan meskipun container dihentikan atau dibuat ulang.

Dengan menggunakan named volume, data BookNest tidak hanya bergantung pada masa hidup container.

Untuk menjaga data, gunakan perintah `docker compose down` tanpa opsi `-v` ketika menghentikan aplikasi.

---

**Dokumentasi ini disusun berdasarkan konfigurasi Docker pada repository BookNest UTS DevOps.**
