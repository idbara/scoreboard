# 🏸 Papan Skor Badminton Digital (Sistem 30 Pindah Bola & Rally Point)

Aplikasi web papan skor digital interaktif modern (*mobile-first*, PWA) yang dirancang khusus untuk mempermudah wasit dan pemain dalam pertandingan bulu tangkis, baik sistem klasik komunitas/tarkam (**30 Pindah Bola**) maupun standar resmi BWF (**Rally Point**).

Dilengkapi tampilan visual lapangan horizontal dari **sudut pandang wasit (*umpire view*)**, pelacakan posisi pemain di atas lapangan secara presisi, pencatatan waktu pertandingan (*live timer*), serta modul analitik statistik pemain dan rekor *head-to-head*.

---

## 🌟 Fitur Utama

### 1. 🪑 Tampilan Lapangan Sudut Pandang Wasit (Umpire View)
* **Orientasi Horizontal**: Lapangan ditampilkan memanjang ke kanan dan kiri sesuai posisi wasit di kursi net:
  * **Sisi Kiri**: Wilayah tim di sebelah kiri wasit.
  * **Sisi Kanan**: Wilayah tim di sebelah kanan wasit.
  * **Net Vertikal & Kursi Wasit**: Net membentang vertikal di tengah dengan indikator kursi wasit (`🪑 Wasit`).
* **Geometri Servis Diagonal Akurat**:
  * Kotak servis kanan dan kiri disesuaikan dengan posisi pemain menghadap ke net.
  * Jalur servis selalu membentuk garis silang (diagonal) melintasi net secara matematis dan visual.
* **Indikator Kok (Shuttlecock 🏸)**: Menunjukkan posisi pemain yang sedang memegang hak servis dan status bola (Bola 1 atau Bola 2).
* **Animasi Pertukaran Posisi**: Animasi rotasi pemain vertikal (`swap-up` dan `swap-down`) saat tim servis mencetak poin.

---

### 2. 👥 Kategori Pertandingan: Ganda & Tunggal
* **Kategori Ganda (Doubles - 2 vs 2)**:
  * Melacak 4 pemain dengan kotak servis kanan dan kiri di masing-masing sisi.
  * Rotasi posisi otomatis saat mencetak poin servis.
* **Kategori Tunggal (Singles - 1 vs 1)**:
  * Menampilkan 1 pemain per sisi secara diagonal.
  * Pemain otomatis berpindah antara kotak **Kanan** (saat skor genap) dan **Kiri** (saat skor ganjil).
  * Kotak yang tidak ditempati menampilkan area lapangan terbuka.
  * Garis batas tunggal (*singles sidelines*) disorot secara visual.

---

### 3. 🎯 Pilihan Sistem Permainan

| Fitur | 30 Pindah Bola (Klasik / Tarkam) | Rally Point (Modern BWF) |
|---|---|---|
| **Target Skor** | 30 Poin (Interval di 15) | 21 Poin (*deuce* maks 30) atau 30 Poin |
| **Poin Reli** | Hanya tim servis yang dapat poin | Setiap reli menghasilkan 1 poin |
| **Hak Servis (Ganda)** | Bola 1 dan Bola 2 (servis pertama hanya 1) | 1 giliran servis per pindah bola |
| **Hak Servis (Tunggal)** | 1 kali servis, langsung pindah bola jika kalah | 1 kali servis, pemenang reli memegang servis |
| **Rotasi Posisi** | Bertukar hanya saat mencetak poin servis | Tim servis bertukar saat mencetak poin; penerima tidak bertukar |

---

### 4. ⏱️ Live Timer & Statistik Pertandingan Otomatis
* **Timer Pertandingan**: Menghitung durasi pertandingan secara langsung per detik (`⏱️ mm:ss`) di bilah atas.
* **Penyimpanan Otomatis**: Ketika laga selesai (*game over*), seluruh data pertandingan otomatis tersimpan ke *Local Storage*.
* **Metrik yang Dicatat**:
  * Waktu, tanggal, dan durasi laga.
  * Kategori (*Tunggal* / *Ganda*) dan Sistem Permainan.
  * Skor akhir dan nama pemenang vs tim kalah.
  * Total reli yang dimainkan.
  * Poin servis (*service points*) vs Poin *break* (*receiver points*).
  * Poin beruntun terbaik (*longest scoring streak*).
  * Frekuensi perpindahan bola (*pindah bola count*).

---

### 5. 📊 Modul Riwayat Pertandingan & Analisis Pemain

Dapat diakses kapan saja dari layar **Setup**, tombol **Menu** saat pertandingan berlangsung, atau layar **Winner**:

1. **Tab Riwayat Pertandingan**:
   * Daftar kartu seluruh pertandingan yang pernah dimainkan.
   * Filter berdasarkan kategori (`Semua`, `👥 Ganda`, `👤 Tunggal`) dan sistem skor.
   * Fitur *expand/collapse* untuk melihat ringkasan statistik reli.
   * Opsi hapus pertandingan satuan atau hapus seluruh riwayat.
2. **Tab Statistik Pemain**:
   * Pencarian instan berdasarkan nama pemain.
   * **Profil Individu**: Total laga, Menang, Kalah, *Win Rate %*, poin dibuat vs kebobolan.
   * **🤝 Pernah Berpasangan Dengan Siapa Saja**: Rekor duet bersama setiap rekan (jumlah laga bersama, menang, kalah, dan *Win Rate %* pasangan).
   * **⚔️ Pernah Melawan Siapa Saja**: Rekor *head-to-head* menghadapi setiap lawan (total pertemuan, menang, kalah, dan *Win Rate %*).
   * **🎯 Riwayat Laga Khusus**: Riwayat pertandingan spesifik yang melibatkan pemain tersebut.

---

### 6. 👆 Kontrol Cepat & Antarmuka Responsif
* **Ketuk Langsung di Lapangan**: Selain tombol bawah (*Tim A Menang* / *Tim B Menang*), wasit dapat mencetak poin dengan mengetuk langsung area lapangan kiri atau kanan.
* **Fitur Undo**: Membatalkan reli terakhir jika terjadi kesalahan input skor/servis.
* **Peringatan Interval**: Layar jeda otomatis saat tim mencapai skor 15 (pada sistem 30) atau skor 11 (pada sistem 21) dengan opsi tukar tempat (*swap sides*).
* **Selebrasi Kemenangan**: Animasi piala dan hujan konfeti saat pertandingan selesai.
* **Dukungan Offline (PWA)**: Dilengkapi `manifest.json` dan *Service Worker* (`sw.js`) agar dapat diinstal di smartphone/tablet dan tetap berjalan lancar tanpa koneksi internet di dalam GOR.

---

## 🛠️ Teknologi yang Digunakan

* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode, full type safety)
* **Frontend Framework**: [React 19](https://react.dev/)
* **Linter & Formatter**: [ESLint 10](https://eslint.org/) (dengan `typescript-eslint` & `eslint-plugin-react-hooks`)
* **Build Tool**: [Vite 8](https://vitejs.dev/)
* **Styling**: [TailwindCSS v3](https://tailwindcss.com/) (dengan kustomisasi animasi, efek *glassmorphism*, dan tema gelap GOR)
* **Storage**: Browser LocalStorage API (persisten dan tanpa ketergantungan server luar)
* **PWA**: Web App Manifest & Service Worker Cache

---

## 📂 Struktur Direktori Proyek

```text
scoreboard/
├── public/
│   ├── favicon.svg             # Favicon kok badminton
│   ├── manifest.json           # Konfigurasi PWA (stand-alone mode)
│   └── sw.js                   # Service worker untuk penggunaan offline
├── src/
│   ├── components/
│   │   ├── ActionButtons.jsx   # Tombol aksi input reli di bawah
│   │   ├── CourtField.jsx      # Visualisasi lapangan wasit horizontal
│   │   ├── CourtHeader.jsx     # Header lapangan (timer, servis, undo, menu)
│   │   ├── CourtView.jsx       # Layar utama pertandingan aktif
│   │   ├── HistoryStatsModal.jsx# Modal riwayat & analitik statistik pemain
│   │   ├── IntervalOverlay.jsx # Layar jeda interval 11 / 15 poin
│   │   ├── MenuOverlay.jsx     # Menu reset, laga baru, & riwayat
│   │   ├── PlayerBox.jsx       # Kartu identitas pemain & indikator kok 🏸
│   │   ├── Scoreboard.jsx      # Papan skor utama yang sinkron sisi wasit
│   │   ├── SetupScreen.jsx     # Layar awal input pemain, kategori, & sistem
│   │   └── WinnerOverlay.jsx   # Layar selebrasi pemenang & ringkasan statistik
│   ├── hooks/
│   │   └── useMatch.js         # Custom hook pengelola state laga, timer & auto-save
│   ├── utils/
│   │   └── storage.js          # Helper LocalStorage & kalkulator statistik pemain
│   ├── App.jsx                 # Komponen akar navigasi layar
│   ├── gameLogic.js            # Pure-function engine aturan badminton
│   ├── index.css               # Gaya global Tailwind & pola net lapangan
│   └── main.jsx                # Entry point aplikasi React
├── index.html                  # Template HTML utama
├── package.json                # Dependensi dan skrip proyek
├── tailwind.config.js          # Konfigurasi Tailwind & keyframes animasi
└── vite.config.js              # Konfigurasi bundler Vite
```

---

## 🚀 Panduan Menjalankan Secara Lokal

### Prasyarat
* [Node.js](https://nodejs.org/) versi 18 atau lebih baru.
* NPM atau PNPM / Yarn.

### Langkah Instalasi

1. **Clone repositori**:
   ```bash
   git clone https://github.com/idbara/scoreboard.git
   cd scoreboard
   ```

2. **Pasang dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan (*development server*)**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`.

4. **Uji Validasi, Tipe, & Linter**:
   ```bash
   npm run typecheck   # Validasi tipe TypeScript (tsc --noEmit)
   npm run lint        # Validasi linter kode (eslint .)
   npm test            # Menjalankan unit test suite (vitest run)
   ```

5. **Kompilasi untuk produksi (*production build*)**:
   ```bash
   npm run build
   ```
   Hasil *bundle* siap di-deploy (misalnya ke Cloudflare Pages, Vercel, atau Netlify) di direktori `dist/`.

---

## 📖 Alur Kerja Game Engine (`src/gameLogic.ts`)

Aturan permainan diimplementasikan sebagai fungsi murni (*pure functions*) yang dapat diuji tanpa dependensi antarmuka:

1. **Inisialisasi (`createInitialState`)**:
   * Menentukan `matchType` (`ganda` atau `tunggal`).
   * Menentukan `gameMode` (`pindah_bola` atau `rally_point`).
   * Mengatur target skor (30 atau 21) dan interval (15 atau 11).
   * Menentukan server pertama di posisi Kanan (indeks 0).

2. **Pemrosesan Reli (`processRally`)**:
   * **Jika Sistem 30 Pindah Bola**:
     * Server menang reli: skor bertambah, pemain bertukar posisi, server yang sama melakukan servis dari sisi berlawanan.
     * Server kalah reli: di ganda berganti ke Bola 2 atau Pindah Bola; di tunggal langsung Pindah Bola.
   * **Jika Sistem Rally Point**:
     * Setiap pemenang reli mendapat 1 poin.
     * Jika server menang: pemain bertukar posisi, server yang sama servis dari sisi berlawanan.
     * Jika penerima menang: penerima menjadi server baru tanpa pertukaran posisi (posisi server ditentukan dari skor genap/ganjil).

3. **Pencatatan Statistik Reli**:
   * Menghitung total reli, reli beruntun (*streak*), poin servis vs poin *break*, dan jumlah pindah bola secara otomatis.

---

## 📱 Petunjuk Penggunaan Wasit di Lapangan

1. **Mulai Pertandingan**:
   * Pilih **Ganda** (2 vs 2) atau **Tunggal** (1 vs 1).
   * Pilih sistem **30 Pindah Bola** atau **Rally Point**.
   * Isi nama pemain dan pilih tim pemegang servis pertama.
2. **Saat Pertandingan Berlangsung**:
   * Ketuk tombol **Tim A Menang** / **Tim B Menang** di bawah, ATAU ketuk langsung sisi lapangan tim yang memenangkan reli.
   * Posisi kok 🏸 dan nomor bola akan berpindah otomatis ke pemain yang berhak servis.
   * Gunakan tombol panah melingkar di kiri atas untuk membatalkan reli jika salah tekan.
3. **Melihat Statistik**:
   * Ketuk menu di kanan atas atau tombol **📊 Riwayat & Statistik** untuk melihat performa pemain, pasangan, dan rekor pertemuan.

---

## 📄 Lisensi

Proyek ini dibuat untuk kebutuhan papan skor pertandingan bulu tangkis digital. Bebas digunakan dan dikembangkan lebih lanjut.
