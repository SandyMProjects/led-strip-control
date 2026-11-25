# Sandy LED Controller (Dual Bluetooth LED Strip Control)

Aplikasi desktop ringan untuk Windows berbasis **Electron** yang berfungsi mengontrol dua modul **Bluetooth Low Energy (BLE) LED Strip** secara terpisah maupun bersamaan langsung dari **Windows System Tray**.

## Perangkat yang Didukung

- **LEDBLE (Tanguixing)** — Menggunakan BLE Service UUID `0xFFE0` & Characteristic `0xFFE1` (protokol header `0x7E ... 0xEF`).
- **BJ_LED (Mohuan)** — Menggunakan BLE Service UUID `0xEEA0` & Characteristic `0xEE01` (protokol header `0x69 0x96 ...`).

## Fitur Utama

- **Dual Device & Master Control**: Kontrol daya (`ON` / `OFF`) dan warna untuk masing-masing LED strip secara independen maupun serentak (`ALL ON` / `ALL OFF`).
- **Windows System Tray Integration**:
  - **Klik Kiri** pada ikon tray untuk membuka/menutup jendela dasbor utama (*auto-hide* saat kehilangan fokus).
  - **Klik Kanan** pada ikon tray untuk membuka menu kontrol cepat tanpa perlu membuka dasbor penuh.
- **Interactive Color Wheel & Presets**: Pemilihan warna RGB dan tingkat kecerahan secara *real-time* menggunakan `iro.js` dengan *throttling* 100 ms agar pengiriman paket BLE tetap stabil, dilengkapi 6 tombol *preset* warna cepat.
- **Last Color Memory**: Menyimpan pilihan warna terakhir setiap perangkat secara otomatis menggunakan `localStorage` dan memulihkannya saat perangkat kembali terhubung.
- **Music Sync Mode**: Menangkap input audio mikrofon secara *real-time* melalui Web Audio API untuk mengubah warna kedua LED strip mengikuti ketukan (*beat*) musik.

## Teknologi yang Digunakan

- **Runtime & Framework**: Node.js, Electron (`v40.2.1`)
- **Hardware Communication**: Web Bluetooth API (GATT)
- **Frontend & UI**: HTML5, CSS3, Bootstrap 5, `iro.js` Color Picker, Web Audio API

## Instalasi & Menjalankan dari Source Code

1. **Pastikan Prasyarat Terpenuhi**:
   - Windows 10/11 dengan adaptor Bluetooth aktif.
   - [Node.js](https://nodejs.org/) (versi LTS) terpasang di sistem.

2. **Clone Repositori**:
   ```bash
   git clone [https://github.com/SandyMProjects/led-strip-control.git](https://github.com/SandyMProjects/led-strip-control.git)
   cd led-strip-control
   ```

3. **Install Dependensi**:
   ```bash
   npm install
   ```

4. **Jalankan Aplikasi**:
   ```bash
   npm start
   ```
   Setelah dijalankan, aplikasi akan berjalan di latar belakang—cek ikon **Sandy LED Controller** di pojok kanan bawah **Windows System Tray**.