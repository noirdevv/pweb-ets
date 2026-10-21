/* =========================================================
   SiPinjol - data.js
   Data buku (dummy), helper localStorage, dan fungsi bersama
   ========================================================= */

const KEY_STOK = "sipinjol_stok";          // { idBuku: sisaStok }
const KEY_PEMINJAMAN = "sipinjol_peminjaman"; // [ { ...dataPeminjaman } ]

/* Gaya sampul per kategori (gradien + ikon Bootstrap Icons) */
const GAYA_KATEGORI = {
  "Fiksi":             { ikon: "bi-water",        dari: "#3f86c9", ke: "#10305c" },
  "Pengembangan Diri": { ikon: "bi-flower2",      dari: "#e48aa9", ke: "#6a98d6" },
  "Filsafat":          { ikon: "bi-moon-stars",   dari: "#1a2a5c", ke: "#4c63ad" },
  "Teknologi":         { ikon: "bi-code-slash",   dari: "#e8906f", ke: "#3b7fd0" },
  "Sejarah":           { ikon: "bi-bank",         dari: "#b8924f", ke: "#5e4423" },
  "Sastra":            { ikon: "bi-sun",          dari: "#2fb0a2", ke: "#1c6fa3" },
  "Sains":             { ikon: "bi-globe-americas", dari: "#0e2748", ke: "#2b8ab5" },
  "Bisnis":            { ikon: "bi-graph-up-arrow", dari: "#37695a", ke: "#86bba6" }
};

const DAFTAR_BUKU = [
  { id: 1,  judul: "Laut Bercerita", penulis: "Leila S. Chudori", kategori: "Fiksi", penerbit: "Kepustakaan Populer Gramedia", tahun: 2017, stok: 5,
    sinopsis: "Laut Bercerita adalah novel yang mengisahkan tentang persahabatan, kehilangan, dan perjuangan para aktivis mahasiswa di masa lalu, diceritakan lewat sudut pandang korban dan keluarga yang ditinggalkan." },
  { id: 2,  judul: "Atomic Habits", penulis: "James Clear", kategori: "Pengembangan Diri", penerbit: "Gramedia Pustaka Utama", tahun: 2019, stok: 3,
    sinopsis: "Panduan membangun kebiasaan baik dan meninggalkan kebiasaan buruk lewat perubahan kecil yang dilakukan secara konsisten." },
  { id: 3,  judul: "Dunia Sophie", penulis: "Jostein Gaarder", kategori: "Filsafat", penerbit: "Mizan", tahun: 2015, stok: 0,
    sinopsis: "Novel yang memperkenalkan sejarah pemikiran filsafat Barat lewat surat-surat misterius yang diterima seorang remaja bernama Sophie." },
  { id: 4,  judul: "Pemrograman Web", penulis: "I Dewa Gede Putra Susila", kategori: "Teknologi", penerbit: "Informatika", tahun: 5025251196, stok: 4,
    sinopsis: "Pengantar membangun situs web dengan HTML, CSS, dan JavaScript, dilengkapi contoh dan latihan untuk pemula." },
  { id: 5,  judul: "Clean Code", penulis: "Robert C. Martin", kategori: "Teknologi", penerbit: "Prentice Hall", tahun: 2008, stok: 3,
    sinopsis: "Prinsip dan praktik menulis kode yang bersih, mudah dibaca, dan mudah dirawat oleh seluruh anggota tim." },
  { id: 6,  judul: "Sapiens", penulis: "Yuval Noah Harari", kategori: "Sejarah", penerbit: "Kepustakaan Populer Gramedia", tahun: 2017, stok: 2,
    sinopsis: "Sejarah singkat umat manusia, dari masa pemburu-pengumpul hingga era teknologi modern." },
  { id: 7,  judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", kategori: "Sastra", penerbit: "Lentera Dipantara", tahun: 2005, stok: 0,
    sinopsis: "Novel tentang Minke, pribumi terpelajar di masa kolonial Hindia Belanda, dan perjuangannya menghadapi ketidakadilan." },
  { id: 8,  judul: "Data Science", penulis: "John D. Kelleher", kategori: "Teknologi", penerbit: "MIT Press", tahun: 2018, stok: 3,
    sinopsis: "Pengantar konsep dasar ilmu data, dari pengumpulan data hingga pembelajaran mesin, untuk pembaca umum." },
  { id: 9,  judul: "Filosofi Teras", penulis: "Henry Manampiring", kategori: "Filsafat", penerbit: "Kompas", tahun: 2018, stok: 6,
    sinopsis: "Pengenalan filsafat Stoa sebagai pegangan menghadapi kecemasan dan masalah sehari-hari." },
  { id: 10, judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: "Sastra", penerbit: "Bentang Pustaka", tahun: 2005, stok: 4,
    sinopsis: "Kisah sepuluh anak di Belitung yang tetap bersemangat belajar di sekolah yang sangat sederhana." },
  { id: 11, judul: "Cantik Itu Luka", penulis: "Eka Kurniawan", kategori: "Sastra", penerbit: "Gramedia Pustaka Utama", tahun: 2002, stok: 0,
    sinopsis: "Novel berlatar sejarah Indonesia yang berpusat pada kisah Dewi Ayu dan keturunannya." },
  { id: 12, judul: "Rich Dad Poor Dad", penulis: "Robert T. Kiyosaki", kategori: "Bisnis", penerbit: "Gramedia Pustaka Utama", tahun: 2018, stok: 5,
    sinopsis: "Membandingkan dua cara pandang tentang uang dan membahas dasar-dasar literasi keuangan." },
  { id: 13, judul: "Introduction to Algorithms", penulis: "Thomas H. Cormen", kategori: "Teknologi", penerbit: "MIT Press", tahun: 2009, stok: 2,
    sinopsis: "Rujukan lengkap tentang perancangan dan analisis algoritma yang banyak dipakai di perkuliahan." },
  { id: 14, judul: "The Pragmatic Programmer", penulis: "Andrew Hunt", kategori: "Teknologi", penerbit: "Addison-Wesley", tahun: 2019, stok: 3,
    sinopsis: "Kumpulan kiat praktis untuk menjadi pengembang perangkat lunak yang efektif dan terus berkembang." },
  { id: 15, judul: "Sejarah Indonesia Modern", penulis: "M.C. Ricklefs", kategori: "Sejarah", penerbit: "Serambi", tahun: 2008, stok: 3,
    sinopsis: "Ulasan sejarah Indonesia sejak kedatangan Islam hingga masa modern." },
  { id: 16, judul: "Guns, Germs, and Steel", penulis: "Jared Diamond", kategori: "Sejarah", penerbit: "W. W. Norton", tahun: 1997, stok: 2,
    sinopsis: "Menjelaskan faktor geografi dan lingkungan yang membentuk perbedaan perkembangan masyarakat di dunia." },
  { id: 17, judul: "Cosmos", penulis: "Carl Sagan", kategori: "Sains", penerbit: "Random House", tahun: 1980, stok: 2,
    sinopsis: "Perjalanan populer menjelajahi alam semesta, dari bintang-bintang hingga asal-usul kehidupan." },
  { id: 18, judul: "Sebuah Seni untuk Bersikap Bodo Amat", penulis: "Mark Manson", kategori: "Pengembangan Diri", penerbit: "Grasindo", tahun: 2018, stok: 4,
    sinopsis: "Pendekatan jujur untuk memilih hal-hal yang benar-benar layak dipedulikan dalam hidup." },
  { id: 19, judul: "Deep Work", penulis: "Cal Newport", kategori: "Pengembangan Diri", penerbit: "Grand Central Publishing", tahun: 2016, stok: 0,
    sinopsis: "Cara membangun fokus mendalam tanpa gangguan agar menghasilkan karya yang bermutu." },
  { id: 20, judul: "Negeri 5 Menara", penulis: "A. Fuadi", kategori: "Fiksi", penerbit: "Gramedia Pustaka Utama", tahun: 2009, stok: 3,
    sinopsis: "Kisah enam santri di sebuah pesantren yang berani bermimpi besar dengan semangat man jadda wajada." },
  { id: 21, judul: "Ronggeng Dukuh Paruk", penulis: "Ahmad Tohari", kategori: "Sastra", penerbit: "Gramedia Pustaka Utama", tahun: 2003, stok: 2,
    sinopsis: "Kisah Srintil, penari ronggeng di sebuah dukuh kecil yang hidupnya terseret gejolak sejarah." },
  { id: 22, judul: "Zero to One", penulis: "Peter Thiel", kategori: "Bisnis", penerbit: "Crown Business", tahun: 2014, stok: 3,
    sinopsis: "Gagasan tentang membangun perusahaan rintisan yang menciptakan sesuatu yang benar-benar baru." },
  { id: 23, judul: "A Brief History of Time", penulis: "Stephen Hawking", kategori: "Sains", penerbit: "Bantam Books", tahun: 1988, stok: 2,
    sinopsis: "Pengantar kosmologi, lubang hitam, dan asal-usul waktu yang ditulis untuk pembaca umum." },
  { id: 24, judul: "Meditations", penulis: "Marcus Aurelius", kategori: "Filsafat", penerbit: "Penguin Classics", tahun: 2006, stok: 2,
    sinopsis: "Catatan pribadi Kaisar Marcus Aurelius tentang disiplin diri dan ketenangan batin." }
];

/* ---------- localStorage ---------- */
function bacaStorage(kunci, cadangan) {
  try {
    const mentah = localStorage.getItem(kunci);
    return mentah ? JSON.parse(mentah) : cadangan;
  } catch (e) {
    return cadangan;
  }
}

function tulisStorage(kunci, nilai) {
  localStorage.setItem(kunci, JSON.stringify(nilai)); // boleh melempar error -> ditangani pemanggil
}

/* Daftar buku dengan stok terbaru (stok awal ditimpa stok dari localStorage) */
function getBooks() {
  const stokTersimpan = bacaStorage(KEY_STOK, {});
  return DAFTAR_BUKU.map(b => ({
    ...b,
    stok: Object.prototype.hasOwnProperty.call(stokTersimpan, b.id) ? stokTersimpan[b.id] : b.stok
  }));
}

function getBook(id) {
  return getBooks().find(b => b.id === Number(id)) || null;
}

function kurangiStok(id) {
  const stokTersimpan = bacaStorage(KEY_STOK, {});
  const buku = getBook(id);
  stokTersimpan[id] = Math.max(0, buku.stok - 1);
  tulisStorage(KEY_STOK, stokTersimpan);
}

function getPeminjaman() {
  return bacaStorage(KEY_PEMINJAMAN, []);
}

function simpanPeminjaman(data) {
  const semua = getPeminjaman();
  semua.push(data);
  tulisStorage(KEY_PEMINJAMAN, semua);
}

/* ---------- Helper tampilan ---------- */
function esc(teks) {
  return String(teks).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function coverHTML(buku, tegak) {
  const g = GAYA_KATEGORI[buku.kategori];
  return `<div class="cover${tegak ? " cover-tegak" : ""}" style="background:linear-gradient(145deg,${g.dari},${g.ke})" role="img" aria-label="Sampul buku ${esc(buku.judul)}">
    <i class="bi ${g.ikon}" aria-hidden="true"></i><span>${esc(buku.judul)}</span></div>`;
}

function statusHTML(buku) {
  return buku.stok > 0
    ? '<span class="chip chip-ada">Tersedia</span>'
    : '<span class="chip chip-habis">Dipinjam</span>';
}

/* ---------- Helper tanggal (waktu lokal) ---------- */
function pad2(n) { return String(n).padStart(2, "0"); }

function keISO(tgl) { // Date -> "YYYY-MM-DD"
  return `${tgl.getFullYear()}-${pad2(tgl.getMonth() + 1)}-${pad2(tgl.getDate())}`;
}

function dariISO(iso) { // "YYYY-MM-DD" -> Date lokal
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function tambahHari(tgl, hari) {
  const hasil = new Date(tgl.getFullYear(), tgl.getMonth(), tgl.getDate());
  hasil.setDate(hasil.getDate() + hari);
  return hasil;
}

function formatTanggal(tgl) { // Date -> "dd/mm/yyyy"
  return `${pad2(tgl.getDate())}/${pad2(tgl.getMonth() + 1)}/${tgl.getFullYear()}`;
}
