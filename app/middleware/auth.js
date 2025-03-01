const jwt = require("jsonwebtoken");
require("dotenv").config()
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  // Dapatkan token dari header Authorization
  const token = req.header("Authorization");
  console.log({ token, JWT_SECRET }, req.header);

  // Periksa jika token tidak ada
  if (!token) {
    return res
      .status(401)
      .json({ message: "Missing token, authorization denied" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Tambahkan user ke request untuk digunakan di endpoint terproteksi
    req.user = decoded;

    // Lanjutkan ke middleware berikutnya atau ke endpoint
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  console.log("woylah", { authHeader, token });

  console.log("Token diterima:", token); // Cek token yang dikirim

  // return res.status(403).json({ message: "masuk" });
  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token is not valid" });
    }

    req.user = decoded; // Simpan data user dari token ke req.user
    next();
  });
};


(module.exports = authMiddleware), verifyToken;
