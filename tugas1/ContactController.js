const ContactModel = require('../models/ContactModel');
const {validateId, validateIdContact} = require('../validation/ContactValidation');
class  ContactController{
    async index(req, res){
        // const data = {
        //     message: "Menampilkan data contact",
        //     data: [],
        // };
        // res.json(data);
        // res.send("Menampilkan data contact");
        try {
            const data = await ContactModel.findAllContact();
            res.json({success: true, total: data.length, data});
        } catch(err){
            res.status(500).json({success:false, message: err.message});
        }
 
    }
    //menampilkan by id dari table contact
    async show (req, res){
        try {
            const {id} = req.params;
            const error = validateId(id);
            if(error) return res.status(400).json({success: false, message: error});
 
            const data = await ContactModel.findById(id);
            if(!data) return res.status(404).json({success: false, message: "User tidak ditemukan"});
            res.json ({success:true, data});
        } catch(err){
            res.status(500).json({success: false, message: err.message});
        }
    }
    store(req, res){
 
        res.send("Menambahkan data");
    }
    update(req, res){
        const {id} = req.params;
        res.send(`Mengupdate data id ${id}`);
    }
     delete(req, res){
        const {id} = req.params;
        res.send(`Menghapus data id ${id}`);
    }
}
const object = new ContactController();
 
module.exports = object;