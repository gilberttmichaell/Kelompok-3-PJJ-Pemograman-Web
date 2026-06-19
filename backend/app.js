//import express
require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const express = require("express");
const router = require("./routes/api");
const db = require("./config/database");
 
//object express
const app = express();
 
//menerjemahkan json
app.use(express.json());
app.use(express.urlencoded({extended: true}));
 
app.use(router); //mengambil dari file routes
 
//testing koneksi
app.get("/test-db", (req, res)=>{
    db.query("Select 1", (err, result)=>{
        if(err){
            res.json({message: "Koneksi database Gagal"});
        } else {
            res.json({
                message: "Koneksi Berhasil",
                result: result
            });
        }
    });
});

app.use(errorHandler);
const PORT = process.env.PORT || 3000 
//deklarasi port => lintasan aplikasi
app.listen(PORT, ()=>{
    console.log(`Server running di port ${PORT}`);
});