# 💌 Surat Kecil Untukmu

Surat cinta interaktif berbasis web. Tulis pesanmu, kirim, lalu buka amplopnya dan lihat apa jawabannya.

## ✨ Fitur

- Amplop animasi yang bisa dibuka, dengan surat yang tertulis pelan-pelan seperti diketik
- Isi surat acak dari kumpulan pesan manis (kalau kolom pesan dikosongkan)
- Tombol **Tidak** yang suka kabur 😆
- Konfeti dan popup perayaan saat menekan **IYA!**
- Musik romantis (dibuat langsung di browser dengan Web Audio, tanpa file mp3)
- Form personalisasi: nama penerima, nama pengirim, pertanyaan, dan isi surat
- Tampilan responsif untuk HP maupun desktop
- Tombol Bagikan (masih dalam perbaikan 🚧)

## 🚀 Cara Menjalankan

Tidak perlu install apa pun.

```bash
git clone https://github.com/USERNAME/surat_Kecil_Untukmu.git
cd surat_Kecil_Untukmu
```

Lalu buka `index.html` di browser. Atau pakai server lokal:

```bash
npx serve
# atau
python -m http.server 8000
```

> Butuh koneksi internet karena Tailwind CSS, Google Fonts, Font Awesome, dan Canvas Confetti dimuat lewat CDN.

## 📁 Struktur File

```
surat_Kecil_Untukmu/
├── index.html           # Struktur halaman
├── style.css            # Gaya kustom (amplop, surat, animasi)
├── script.js            # Logika: buka amplop, efek ketik, tombol kabur, musik, form
├── messages.js          # Kumpulan isi surat acak
└── tailwind-config.js   # Konfigurasi warna dan font Tailwind
```

## 🛠️ Kustomisasi

- **Tambah isi surat acak:** edit array `letterMessages` di `messages.js`.
- **Ganti warna dan font:** edit `tailwind-config.js` dan `style.css`.
- **Kecepatan ketik:** ubah `typeSpeed` di `script.js` (satuan milidetik per huruf).
- **Form kirim pesan:** memakai [Web3Forms](https://web3forms.com). Ganti `WEB3FORMS_KEY` di `script.js` dengan access key milikmu sendiri.

## 🧰 Teknologi

HTML, CSS, JavaScript, [Tailwind CSS](https://tailwindcss.com), [Font Awesome](https://fontawesome.com), [canvas-confetti](https://github.com/catdad/canvas-confetti), dan Web Audio API.

## 📄 Lisensi

Bebas dipakai dan dimodifikasi untuk keperluan pribadi. 
