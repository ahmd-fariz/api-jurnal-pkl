const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const Siswa = db.siswa;
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

// Fungsi login siswa
exports.authsiswa = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari siswa berdasarkan email
    const siswa = await Siswa.findOne({
      where: { email },
    });

    if (!siswa || !(await bcrypt.compare(password, siswa.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: siswa.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fungsi logout (Token dihapus di frontend)
exports.logout = (req, res) => {
  try {
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
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
    //   console.log("Decoded JWT:", decoded); // Debugging
  
      if (!decoded || !decoded.id) {
        return res.status(401).json({ message: "Invalid token" });
      }
  
      // Cari siswa berdasarkan ID
      const siswa = await Siswa.findOne({ where: { id: decoded.id } });
    //   console.log("Siswa ditemukan:", siswa); // Debugging
  
      if (!siswa) {
        return res.status(404).json({ message: "Siswa not found" });
      }

  
      res.json({ data: siswa });
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  