const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const Pembimbing = db.pembimbing;
const fs = require("fs");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Fungsi login siswa
exports.authpembimbing = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari siswa berdasarkan email
    const pembimbing = await Pembimbing.findOne({
      where: { email },
    });

    if (!pembimbing || !(await bcrypt.compare(password, pembimbing.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: pembimbing.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
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
    const pembimbing = await Pembimbing.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ["password"] },
    });

    if (!pembimbing) {
      return res.status(404).json({ message: "pembimbing not found" });
    }

    res.json({ data: pembimbing });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
