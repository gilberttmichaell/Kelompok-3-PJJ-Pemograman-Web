const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateRegister, validateLogin } = require("../validation/authValidator.js");

class AuthController {

  async register(req, res) {
    try {
      const data = req.body;

      const error = validateRegister(data);
      if (error) return res.status(400).json({ success: false, message: error });

      const existingUser = await User.findByEmail(data.email);
      if (existingUser && existingUser.length > 0) {
        return res.status(400).json({ success: false, message: "Email sudah terdaftar" });
      }

      const hashed = await bcrypt.hash(data.password, 10);

      await User.create({
        name: data.name,
        email: data.email,
        password: hashed,
        // Registrasi publik tidak boleh dipakai untuk membuat akun admin.
        role: "staff"
      });

      return res.status(201).json({ success: true, message: "Register berhasil" });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
  }

  async login(req, res) {
    try {
      const data = req.body;

      const error = validateLogin(data);
      if (error) return res.status(400).json({ success: false, message: error });

      const result = await User.findByEmail(data.email);
      if (!result || result.length === 0) {
        return res.status(404).json({ success: false, message: "User tidak ditemukan" });
      }

      const user = result[0];

      const match = await bcrypt.compare(data.password, user.password);
      if (!match) {
        return res.status(401).json({ success: false, message: "Login gagal, password salah" });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
      );

      return res.json({
        success: true,
        message: "Login berhasil",
        token,
        user: { id: user.id, name: user.name, role: user.role }
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
  }
}

module.exports = new AuthController();
