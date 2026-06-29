const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const {validateId, validateStore, validateUpdate} = require('../validation/userValidation');
class UserController{
    async index(req, res){
        // const data = {
        //     message: "Menampilkan data user",
        //     data: [],
        // };
        // res.json(data);
        // res.send("Menampilkan data user");
        try {
            const data = await UserModel.findAllUser();
            res.json({success: true, total: data.length, data});
        } catch(err){
            res.status(500).json({success:false, message: err.message});
        }
 
    }
    //menampilkan by id dari table users
    async show (req, res){
        try {
            const {id} = req.params;
            const error = validateId(id);
            if(error) return res.status(400).json({success: false, message: error});
 
            const data = await UserModel.findByIdUser(id);
            if(!data) return res.status(404).json({success: false, message: "User tidak ditemukan"});
            res.json ({success:true, data});
        } catch(err){
            res.status(500).json({success: false, message: err.message});
        }
    }
    async store(req, res, next){
        try {
            const errors = validateStore(req.body);
            if (errors) return res.status(400).json({success: false, errors});
            if (await UserModel.findByEmail(req.body.email)) {
                return res.status(400).json({success: false, message: 'Email sudah terdaftar'});
            }
            const password = await bcrypt.hash(req.body.password, 10);
            const id = await UserModel.store({...req.body, password});
            res.status(201).json({success: true, message: 'User berhasil ditambahkan', data: {id}});
        } catch (err) {
            next(err);
        }
    }
    async update(req, res, next){
        try {
            const {id} = req.params;
            const idError = validateId(id);
            if (idError) return res.status(400).json({success: false, message: idError});
            const errors = validateUpdate(req.body);
            if (errors) return res.status(400).json({success: false, errors});

            const existingEmail = await UserModel.findByEmail(req.body.email);
            if (existingEmail && Number(existingEmail.id) !== Number(id)) {
                return res.status(400).json({success: false, message: 'Email sudah digunakan user lain'});
            }

            const payload = {...req.body};
            if (payload.password) payload.password = await bcrypt.hash(payload.password, 10);
            const affected = await UserModel.update(id, payload);
            if (!affected) return res.status(404).json({success: false, message: 'User tidak ditemukan'});
            res.json({success: true, message: 'User berhasil diupdate'});
        } catch (err) {
            next(err);
        }
    }
    async destroy(req, res, next){
        try {
            const {id} = req.params;
            const idError = validateId(id);
            if (idError) return res.status(400).json({success: false, message: idError});
            if (Number(id) === Number(req.user.id)) {
                return res.status(400).json({success: false, message: 'Admin tidak dapat menghapus akun yang sedang dipakai'});
            }
            const affected = await UserModel.destroy(id);
            if (!affected) return res.status(404).json({success: false, message: 'User tidak ditemukan'});
            res.json({success: true, message: 'User berhasil dihapus'});
        } catch (err) {
            next(err);
        }
    }
}
const object = new UserController();
 
module.exports = object;    
