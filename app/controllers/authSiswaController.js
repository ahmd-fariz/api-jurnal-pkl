const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const Siswa = db.siswa;
const { JWT_SECRET } = require("../configs/database"); // Mengimpor nilai JWT_SECRET dari file konfigurasi

exports.authsiswa = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari administrator berdasarkan email
    const siswa = await Siswa.findOne({
      where: { email: email },
    });

    // Jika administrator tidak ditemukan atau password salah, kirim respons error
    if (!siswa || !(await bcrypt.compare(password, siswa.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: siswa.id }, JWT_SECRET, {
      // Menggunakan JWT_SECRET sebagai kunci rahasia
      expiresIn: "1h",
    });

    // Kirim token sebagai respons
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.getUserByToken = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const siswa = await Siswa.findById(req.user.id).select("-password"); // Ambil data tanpa password
//     if (!siswa) {
//       return res.status(404).json({ message: "Siswa not found" });
//     }
//     res.status(200).json(siswa);
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Fungsi logout
exports.logout = (req, res) => {
    try {
      // Dapatkan token dari header Authorization
      const token = req.header("Authorization");
  
      // Periksa jika token tidak ada
      if (!token) {
        return res.status(401).json({ message: "Missing token, logout failed" });
      }
  
      // Verifikasi token dan ambil ID pengguna dari token
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;
  
      // Hapus token dari sisi klien (misalnya, dengan menghapus token dari local storage)
  
      // Kirim respons logout berhasil
      res.json({ message: "Logout successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  exports.cekToken = async (req, res) => {
    try {
      // Dapatkan token dari header Authorization
      const token = req.header("Authorization");
  
      if (!token) {
        return res.status(401).json({ message: "Missing token, logout failed" });
      }
  
      // decode JWT untuk mendapatkan id dari user
      decodeJWTAndGetID(token)
        .then(async (id) => {
          const administrator = await Administrators.findOne({
            where: { id: id },
          });
  
          res.json({ role: administrator.role });
        })
        .catch((err) => {
          res.status(500).json({ message: `Gagal mendeskripsi JWT:`, err });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: `Internal server error ${error}` });
    }
  };
  

  function decodeJWTAndGetID(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          // mengambbil id dari payload JWT
          const id = decoded.id;
          resolve(id);
        }
      });
    });
  }