# Checklist wajib sebelum mengumpulkan UTS

- [ ] Docker Desktop aktif dan perintah `docker compose up -d --build --wait` sukses.
- [ ] `docker compose ps` menunjukkan 3 service: frontend, backend, db, semuanya **healthy**.
- [ ] Aplikasi BookNest tampil pada http://localhost:8080.
- [ ] Tambah, edit, hapus, cari, dan filter buku sudah benar-benar dicoba.
- [ ] Akses http://localhost:8080/api/health menghasilkan status `ok` dan database `connected`.
- [ ] Data buku terlihat di PostgreSQL melalui perintah `SELECT`.
- [ ] Repo GitHub kelompok berisi source code dan workflow, tanpa file `.env`.
- [ ] CI pada tab Actions sukses menguji ketiga container setelah push.
- [ ] Runner Windows berstatus Online dan job CD sukses (bukan queued).
- [ ] Satu perubahan teks UI terbukti muncul setelah push, tanpa deploy manual.
- [ ] Video menampilkan seluruh 5 anggota open-camera dan alur deploy + CI/CD.
- [ ] Video sudah diunggah dan dapat diakses dosen.
- [ ] Laporan berisi nama 5 anggota, NIM, teknologi/versi aktual, referensi, bukti screenshot, repo, link video deployment dan CI/CD.
- [ ] Kejujuran penggunaan AI dijelaskan (jangan klaim menulis seluruh kode sendiri bila memakai AI).
- [ ] Word disimpan dengan nama `UTS_[NIM_PERWAKILAN].docx`.
