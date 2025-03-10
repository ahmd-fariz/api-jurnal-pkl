const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const Administrators = db.administrators; // Menggunakan model Administrators
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari administrator berdasarkan email
    const administrator = await Administrators.findOne({
      where: { email: email },
    });

    // Jika administrator tidak ditemukan atau password salah, kirim respons error
    if (
      !administrator ||
      !(await bcrypt.compare(password, administrator.password))
    ) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: administrator.id }, JWT_SECRET, {
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
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    // Decode token dan ambil ID siswa
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Cari siswa berdasarkan ID dengan include
    const admin = await db.administrators.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ["password"] },
    });

    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }

    res.json({ data: admin });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
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
