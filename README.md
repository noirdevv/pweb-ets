# 1. Deskripsi Sistem

Sebuah perpustakaan perguruan tinggi masih mencatat peminjaman buku secara manual di buku besar dan kartu peminjaman. Cara ini menimbulkan beberapa masalah: pengunjung tidak tahu apakah sebuah buku sedang tersedia atau dipinjam, petugas kesulitan melacak tanggal jatuh tempo, keterlambatan pengembalian sering tidak terpantau, dan rekap peminjaman memakan waktu lama.

Sebagai solusi, perpustakaan membutuhkan aplikasi web bernama SiPinjol, Sistem Peminjaman Buku Online. Aplikasi ini memiliki landing page informatif, katalog buku yang bisa dicari, formulir peminjaman online, dan halaman pemantauan peminjaman untuk petugas.

# 2. Identifikasi Kebutuhan Sistem

## A. Landing Page
Tujuan: memberi gambaran layanan dan mengarahkan pengunjung ke katalog atau peminjaman.

- Header responsif dengan logo dan nama perpustakaan
- Hero section berisi judul dan deskripsi singkat
- Ringkasan alur peminjaman dalam 3 langkah (pilih buku, isi form, ambil di perpustakaan)
- Highlight koleksi terbaru atau terpopuler
- Statistik ilustratif: jumlah buku, peminjam aktif, kategori koleksi
- Footer berisi kontak dan jam layanan

## B. Katalog Buku
Tujuan: membantu pengunjung menemukan buku dan mengetahui statusnya.

- Tampilan koleksi dalam bentuk kartu (cover, judul, penulis, kategori)
- Pencarian berdasarkan judul atau penulis
- Filter berdasarkan kategori dan status (tersedia/dipinjam)
- Modal detail buku (sinopsis, penerbit, tahun, jumlah stok)
- Tombol “Pinjam” yang menuju form dengan buku terpilih

## C. Form Peminjaman
Tujuan: menggantikan pencatatan manual dengan formulir digital.

- Kolom: nama peminjam, NRP, email, buku yang dipinjam, tanggal pinjam, lama pinjam (3, 7, atau 14 hari)
- Tanggal jatuh tempo terhitung otomatis
- Validasi: kolom wajib diisi, format email, dan buku yang stoknya habis tidak bisa dipilih
- Notifikasi berhasil atau gagal, lalu data tersimpan ke localStorage dan stok berkurang

# 3. Struktur Website

SiPinjol\
├── index.html     Beranda (Landing Page)\
├── katalog.html   Katalog Buku\
│                    └── Modal Detail Buku\
└── pinjam.html    Form Peminjaman\

# 4. Struktur Sistem

sipinjol/\
├── index.html, katalog.html, pinjam.html\
├── css/style.css\
└── js/ (data.js, katalog.js, pinjam.js)\

# 5. Rancangan Halaman

## A. Landing Page

![](img/wf-landingpage)

## B. Katalog Buku

![](img/wf-katalogbuku)

## C. Form Peminjaman

![](img/wf-formpeminjaman)

# 6. Desain UI Landing Page

![](img/desainui-landingpage)
