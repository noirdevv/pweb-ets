/* =========================================================
   SiPinjol - pinjam.js
   Form peminjaman: validasi, jatuh tempo otomatis,
   simpan ke localStorage, stok berkurang, notifikasi
   ========================================================= */
(function () {
  const $ = id => document.getElementById(id);

  const form = $("formPinjam");
  const f = {
    nama: $("nama"),
    nrp: $("nrp"),
    email: $("email"),
    buku: $("buku"),
    tgl: $("tglPinjam"),
    tempo: $("jatuhTempo")
  };
  const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const REGEX_NRP = /^\d{10}$/;

  /* ---------- Notifikasi (toast) ---------- */
  function notifikasi(jenis, judul, pesan) {
    const t = document.createElement("div");
    t.className = `toast toast-${jenis}`;
    t.setAttribute("role", "alert");
    t.setAttribute("aria-live", "assertive");
    t.innerHTML = `
      <div class="d-flex">
        <i class="bi ${jenis === "sukses" ? "bi-check-circle-fill" : "bi-x-circle-fill"} toast-ikon" aria-hidden="true"></i>
        <div class="toast-body"><strong>${esc(judul)}</strong><br>${esc(pesan)}</div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Tutup"></button>
      </div>`;
    $("wadahToast").appendChild(t);
    t.addEventListener("hidden.bs.toast", () => t.remove());
    new bootstrap.Toast(t, { delay: 7000 }).show();
  }

  /* ---------- Pilihan buku ---------- */
  function isiPilihanBuku(idTerpilih) {
    const buku = getBooks();
    f.buku.innerHTML = '<option value="">Pilih buku</option>' + buku.map(b =>
      `<option value="${b.id}"${b.stok <= 0 ? " disabled" : ""}>${esc(b.judul)} - ${esc(b.penulis)}${b.stok <= 0 ? " (stok habis)" : ""}</option>`
    ).join("");
    if (idTerpilih) f.buku.value = String(idTerpilih);
  }

  function perbaruiBuku() {
    const b = f.buku.value ? getBook(f.buku.value) : null;
    const info = $("infoStokTeks");
    const panel = $("panelBuku");

    if (!b) {
      info.textContent = "Pilih buku dari katalog. Buku yang stoknya habis tidak dapat dipilih.";
      panel.innerHTML = `<div class="panel-kosong"><i class="bi bi-journal-bookmark" aria-hidden="true"></i>Belum ada buku dipilih.<br><a href="katalog.html">Lihat katalog</a></div>`;
      return;
    }
    info.textContent = `Stok tersedia: ${b.stok} buku`;
    panel.innerHTML = `
      <div class="row g-3">
        <div class="col-5">${coverHTML(b, true)}</div>
        <div class="col-7">
          <h3 class="h6 fw-bold mb-0">${esc(b.judul)}</h3>
          <p class="small text-secondary mb-2">${esc(b.penulis)}</p>
          <span class="chip chip-kategori">${esc(b.kategori)}</span>
        </div>
      </div>
      <dl class="dl-buku">
        <dt>Penerbit</dt><dd>${esc(b.penerbit)}</dd>
        <dt>Tahun terbit</dt><dd>${b.tahun}</dd>
        <dt>Stok</dt><dd>${b.stok}</dd>
      </dl>`;
  }

  /* ---------- Jatuh tempo otomatis ---------- */
  function lamaPinjam() {
    const dipilih = form.querySelector('input[name="lama"]:checked');
    return dipilih ? Number(dipilih.value) : 0;
  }

  function hitungJatuhTempo() {
    if (!f.tgl.value || !lamaPinjam()) { f.tempo.value = ""; return null; }
    const tempo = tambahHari(dariISO(f.tgl.value), lamaPinjam());
    f.tempo.value = formatTanggal(tempo);
    return tempo;
  }

  /* ---------- Validasi ---------- */
  function setError(input, pesan) {
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
    const fb = input.closest(".field").querySelector(".invalid-feedback");
    fb.textContent = pesan;
  }

  function hapusError(input) {
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-invalid");
  }

  function validasi() {
    let valid = true;
    [f.nama, f.nrp, f.email, f.buku, f.tgl].forEach(hapusError);
    const gagal = (input, pesan) => { setError(input, pesan); valid = false; };

    if (!f.nama.value.trim()) gagal(f.nama, "Nama peminjam wajib diisi.");
    else if (f.nama.value.trim().length < 3) gagal(f.nama, "Nama minimal 3 karakter.");

    if (!f.nrp.value.trim()) gagal(f.nrp, "NRP wajib diisi.");
    else if (!REGEX_NRP.test(f.nrp.value.trim())) gagal(f.nrp, "NRP harus terdiri dari 10 digit angka.");

    if (!f.email.value.trim()) gagal(f.email, "Email wajib diisi.");
    else if (!REGEX_EMAIL.test(f.email.value.trim())) gagal(f.email, "Format email tidak valid. Contoh: nama@domain.ac.id");

    if (!f.buku.value) {
      gagal(f.buku, "Pilih buku yang ingin dipinjam.");
    } else {
      const b = getBook(f.buku.value);
      if (!b || b.stok <= 0) gagal(f.buku, "Stok buku ini habis, pilih buku lain.");
    }

    if (!f.tgl.value) gagal(f.tgl, "Tanggal pinjam wajib diisi.");
    else if (f.tgl.value < keISO(new Date())) gagal(f.tgl, "Tanggal pinjam tidak boleh sebelum hari ini.");

    if (!lamaPinjam()) valid = false;
    return valid;
  }

  /* ---------- Nilai awal ---------- */
  function setNilaiAwal() {
    const hariIni = keISO(new Date());
    f.tgl.min = hariIni;
    f.tgl.value = hariIni;
    hitungJatuhTempo();
  }

  /* ---------- Submit ---------- */
  form.addEventListener("submit", e => {
    e.preventDefault();

    if (!validasi()) {
      notifikasi("gagal", "Pengajuan gagal", "Periksa kembali kolom yang ditandai merah.");
      const pertama = form.querySelector(".is-invalid");
      if (pertama) pertama.focus();
      return;
    }

    const buku = getBook(f.buku.value); // baca ulang stok terbaru
    if (!buku || buku.stok <= 0) {
      isiPilihanBuku();
      perbaruiBuku();
      notifikasi("gagal", "Pengajuan gagal", "Stok buku sudah habis. Silakan pilih buku lain.");
      return;
    }

    const tempo = hitungJatuhTempo();
    const data = {
      id: "PJ-" + Date.now(),
      nama: f.nama.value.trim(),
      nrp: f.nrp.value.trim(),
      email: f.email.value.trim(),
      bukuId: buku.id,
      judul: buku.judul,
      tglPinjam: f.tgl.value,
      lamaHari: lamaPinjam(),
      jatuhTempo: keISO(tempo),
      status: "Dipinjam",
      diajukanPada: new Date().toISOString()
    };

    try {
      simpanPeminjaman(data);
      kurangiStok(buku.id);
    } catch (err) {
      notifikasi("gagal", "Data tidak tersimpan", "Penyimpanan di browser gagal. Coba lagi atau periksa pengaturan browser Anda.");
      return;
    }

    notifikasi("sukses", "Peminjaman berhasil",
      `Buku "${buku.judul}" dipinjam sampai ${formatTanggal(tempo)}. Ambil bukunya di perpustakaan.`);

    form.reset();
    [f.nama, f.nrp, f.email, f.buku, f.tgl].forEach(hapusError);
    isiPilihanBuku();
    setNilaiAwal();
    perbaruiBuku();
  });

  /* ---------- Reset ---------- */
  form.addEventListener("reset", () => {
    // dijalankan setelah nilai form dikembalikan oleh browser
    setTimeout(() => {
      [f.nama, f.nrp, f.email, f.buku, f.tgl].forEach(hapusError);
      isiPilihanBuku();
      setNilaiAwal();
      perbaruiBuku();
    }, 0);
  });

  /* ---------- Event input ---------- */
  [f.nama, f.nrp, f.email, f.buku, f.tgl].forEach(input => {
    input.addEventListener("input", () => hapusError(input));
    input.addEventListener("change", () => hapusError(input));
  });
  f.nrp.addEventListener("input", () => { f.nrp.value = f.nrp.value.replace(/\D/g, ""); });
  f.buku.addEventListener("change", perbaruiBuku);
  f.tgl.addEventListener("change", hitungJatuhTempo);
  f.tgl.addEventListener("input", hitungJatuhTempo);
  form.querySelectorAll('input[name="lama"]').forEach(r => r.addEventListener("change", hitungJatuhTempo));

  /* ---------- Inisialisasi (mendukung ?id=... dari katalog) ---------- */
  const idDariUrl = new URLSearchParams(location.search).get("id");
  isiPilihanBuku(idDariUrl);
  setNilaiAwal();
  perbaruiBuku();

  if (idDariUrl) {
    const b = getBook(idDariUrl);
    if (b && b.stok <= 0) {
      notifikasi("gagal", "Buku tidak tersedia", `Stok "${b.judul}" sedang habis. Silakan pilih buku lain.`);
    }
  }
})();
