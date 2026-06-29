// app.js

require("dotenv").config();

const express = require("express");
const db = require("./config/database.js");
const router = require("./routes/api.js");
const errorHandler = require("./middleware/errorHandler.js");
const cors = require("cors")
const app = express();

//konfigurasi cors  
app.use(cors({
    origin:'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(router);


// Test koneksi database hanya untuk admin yang sudah login.
const auth = require("./middleware/auth.js");
const authorize = require("./middleware/authorize.js");
app.get("/test-db", auth, authorize("admin"), async (req, res, next) => {
    try {
        const [result] = await db.query("SELECT 1");

        res.json({
            success: true,
            message: "Koneksi Berhasil",
            result
        });

    } catch (err) { next(err); }
});

// ... semua routes di sini ...

// Error handler — HARUS setelah semua routes

app.use(errorHandler); // tambah

const PORT = process.env.PORT || 3000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`);
    });
}

module.exports = app;
