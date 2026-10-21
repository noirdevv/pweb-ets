/* =========================================================
   SiPinjol - katalog.js
   Pencarian, filter kategori/status, urutan, paginasi, modal detail
   ========================================================= */
(function () {
  const PER_HALAMAN = 8;
  const $ = id => document.getElementById(id);

  const el = {
    cari: $("cariBuku"),
    cariHeader: $("cariHeader"),
    formHeader: $("formCariHeader"),
    kategori: $("filterKategori"),
    tersedia: $("statusTersedia"),
    dipinjam: $("statusDipinjam"),
    urutkan: $("urutkan"),
    reset: $("btnResetFilter"),
    daftar: $("daftarBuku"),
    jumlah: $("jumlahHasil"),
    paginasi: $("paginasi")
  };

  const state = { q: "", kategori: "", tersedia: true, dipinjam: true, urut: "terbaru", halaman: 1 };
  const modalDetail = new bootstrap.Modal($("modalDetail"));

  /* ---------- Isi pilihan kategori ---------- */
  Object.keys(GAYA_KATEGORI).forEach(k => {
    el.kategori.insertAdjacentHTML("beforeend", `<option value="${esc(k)}">${esc(k)}</option>`);
  });

  /* ---------- Ambil kata kunci dari URL (?q=...) ---------- */
  const awal = new URLSearchParams(location.search).get("q");
  if (awal) {
    state.q = awal.trim();
    el.cari.value = state.q;
    el.cariHeader.value = state.q;
  }

  /* ---------- Filter + urut ---------- */
  function hasilFilter() {
    const q = state.q.toLowerCase();
    const daftar = getBooks().filter(b => {
      const cocokKata = !q || b.judul.toLowerCase().includes(q) || b.penulis.toLowerCase().includes(q);
      const cocokKategori = !state.kategori || b.kategori === state.kategori;
      const ada = b.stok > 0;
      // jika kedua kotak status kosong, tampilkan semua
      const cocokStatus = (!state.tersedia && !state.dipinjam) || (ada && state.tersedia) || (!ada && state.dipinjam);
      return cocokKata && cocokKategori && cocokStatus;
    });

    const urut = {
      terbaru: (a, b) => b.tahun - a.tahun || a.id - b.id,
      judul: (a, b) => a.judul.localeCompare(b.judul, "id"),
      penulis: (a, b) => a.penulis.localeCompare(b.penulis, "id"),
      stok: (a, b) => b.stok - a.stok || a.judul.localeCompare(b.judul, "id")
    };
    return daftar.sort(urut[state.urut]);
  }

  /* ---------- Render ---------- */
  function kartuHTML(b) {
    const tombol = b.stok > 0
      ? `<a class="btn btn-pinjam" href="pinjam.html?id=${b.id}">Pinjam</a>`
      : `<button class="btn btn-pinjam" type="button" disabled>Pinjam</button>`;
    return `
      <div class="col">
        <article class="kartu-buku">
          <button class="buka" type="button" data-detail="${b.id}" aria-label="Lihat detail ${esc(b.judul)}">
            ${coverHTML(b)}
            <h3>${esc(b.judul)}</h3>
            <p class="penulis">${esc(b.penulis)}</p>
          </button>
          <div class="chips"><span class="chip chip-kategori">${esc(b.kategori)}</span>${statusHTML(b)}</div>
          ${tombol}
        </article>
      </div>`;
  }

  function render() {
    const hasil = hasilFilter();
    const totalHalaman = Math.max(1, Math.ceil(hasil.length / PER_HALAMAN));
    state.halaman = Math.min(state.halaman, totalHalaman);
    const mulai = (state.halaman - 1) * PER_HALAMAN;
    const tampil = hasil.slice(mulai, mulai + PER_HALAMAN);

    el.jumlah.textContent = `Hasil Pencarian (${hasil.length} buku)`;

    if (hasil.length === 0) {
      el.daftar.innerHTML = `<div class="col-12"><div class="kosong"><i class="bi bi-journal-x" aria-hidden="true"></i>
        <strong>Buku tidak ditemukan</strong><br>Coba kata kunci lain atau klik Reset Filter.</div></div>`;
    } else {
      el.daftar.innerHTML = tampil.map(kartuHTML).join("");
    }
    renderPaginasi(totalHalaman);
  }

  function renderPaginasi(total) {
    if (total <= 1) { el.paginasi.innerHTML = ""; return; }
    let html = `<button type="button" data-hal="${state.halaman - 1}" aria-label="Halaman sebelumnya" ${state.halaman === 1 ? "disabled" : ""}><i class="bi bi-chevron-left"></i></button>`;
    for (let i = 1; i <= total; i++) {
      html += `<button type="button" data-hal="${i}" class="${i === state.halaman ? "aktif" : ""}" ${i === state.halaman ? 'aria-current="page"' : ""}>${i}</button>`;
    }
    html += `<button type="button" data-hal="${state.halaman + 1}" aria-label="Halaman berikutnya" ${state.halaman === total ? "disabled" : ""}><i class="bi bi-chevron-right"></i></button>`;
    el.paginasi.innerHTML = html;
  }

  /* ---------- Modal detail ---------- */
  function bukaDetail(id) {
    const b = getBook(id);
    if (!b) return;
    $("modalCover").innerHTML = coverHTML(b, true);
    $("modalJudul").textContent = b.judul;
    $("modalPenulis").textContent = b.penulis;
    $("modalChip").innerHTML = `<span class="chip chip-kategori">${esc(b.kategori)}</span>${statusHTML(b)}`;
    $("modalPenerbit").textContent = b.penerbit;
    $("modalTahun").textContent = b.tahun;
    $("modalStok").textContent = b.stok > 0 ? `${b.stok} buku` : "Habis";
    $("modalSinopsis").textContent = b.sinopsis;

    const tombol = $("modalPinjam");
    if (b.stok > 0) {
      tombol.href = `pinjam.html?id=${b.id}`;
      tombol.classList.remove("disabled");
      tombol.removeAttribute("aria-disabled");
    } else {
      tombol.removeAttribute("href");
      tombol.classList.add("disabled");
      tombol.setAttribute("aria-disabled", "true");
    }
    modalDetail.show();
  }

  /* ---------- Event ---------- */
  function perbarui() { state.halaman = 1; render(); }

  el.cari.addEventListener("input", () => {
    state.q = el.cari.value.trim();
    el.cariHeader.value = el.cari.value;
    perbarui();
  });

  // Kotak cari di header: filter langsung tanpa memuat ulang halaman
  el.formHeader.addEventListener("submit", e => {
    e.preventDefault();
    state.q = el.cariHeader.value.trim();
    el.cari.value = el.cariHeader.value;
    perbarui();
  });

  el.kategori.addEventListener("change", () => { state.kategori = el.kategori.value; perbarui(); });
  el.tersedia.addEventListener("change", () => { state.tersedia = el.tersedia.checked; perbarui(); });
  el.dipinjam.addEventListener("change", () => { state.dipinjam = el.dipinjam.checked; perbarui(); });
  el.urutkan.addEventListener("change", () => { state.urut = el.urutkan.value; perbarui(); });

  el.reset.addEventListener("click", () => {
    Object.assign(state, { q: "", kategori: "", tersedia: true, dipinjam: true, urut: "terbaru", halaman: 1 });
    el.cari.value = "";
    el.cariHeader.value = "";
    el.kategori.value = "";
    el.tersedia.checked = true;
    el.dipinjam.checked = true;
    el.urutkan.value = "terbaru";
    render();
  });

  el.daftar.addEventListener("click", e => {
    const pemicu = e.target.closest("[data-detail]");
    if (pemicu) bukaDetail(pemicu.dataset.detail);
  });

  el.paginasi.addEventListener("click", e => {
    const tombol = e.target.closest("button[data-hal]");
    if (!tombol || tombol.disabled) return;
    state.halaman = Number(tombol.dataset.hal);
    render();
    $("atasHasil").scrollIntoView({ block: "start" });
  });

  render();
})();
