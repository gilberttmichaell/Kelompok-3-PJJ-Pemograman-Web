const CustomerModel = require('../models/CustomerModel');
const {validateId, validateStore, validateUpdate} = require('../validation/customerValidation');
class CustomerController{
    async index(req, res){
        // const data = {
        //     message: "Menampilkan data customer",
        //     data: [],
        // };
        // res.json(data);
        // res.send("Menampilkan data customers");
        try {
            const data = await CustomerModel.findAll();
            res.json({success: true, total: data.length, data});
        } catch(err){
            res.status(500).json({success:false, message: err.message});
        }
    }
    //menampilkan by id dari table customers
    async show (req, res){
        try {
            const {id} = req.params;
            const error = validateId(id);
            if(error) return res.status(400).json({success: false, message: error});
 
            const data = await CustomerModel.findById(id);
            if(!data) return res.status(404).json({success: false, message: "Customer tidak ditemukan"});
            res.json ({success:true, data});
        } catch(err){
            res.status(500).json({success: false, message: err.message});
        }
    }
   async store(req, res, next){
 
        // res.send("Menambahkan data");
        try{
            const errors = validateStore(req.body);
            if(errors) return res.status(400).json({success:false, errors});
            const id = await CustomerModel.store(req.body);
            res.status(201).json({
                success: true,
                message: 'Customer berhasil ditambahkan',
                data : {id},
            });
        } catch (err){
            next(err);
        }
    }
 
    async update(req, res, next){
    try{
        const {id} = req.params;
        const idError = validateId(id);
        if (idError) return res.json(400).json({success:false, message: idError});
 
        const errors = validateUpdate(req.body);
        if(errors) return res.status(400).json({success:false, errors});
 
         const affected = await CustomerModel.update(id, req.body)// mengakses id mana yang akan diupdate
         if(!affected) return res.status(404).json({success:false, message: 'Customer Tidak Ditemukan'});
         res.json({success: true, message: 'Customer Berhasil Diupdate'});
        // res.send(`Mengupdate data id ${id}`);
    } catch (err){
        next(err);
    }
}
     async destroy(req, res, next){
        // const {id} = req.params;
        // res.send(`Menghapus data id ${id}`);
         try{
        const {id} = req.params;
        const idError = validateId(id);
        if (idError) return res.json(400).json({success:false, message: idError});
 
         const affected = await CustomerModel.destroy(id, req.body)// mengakses id mana yang akan diupdate
         if(!affected) return res.status(404).json({success:false, message: 'Customer Tidak Ditemukan'});
         
         res.json({success: true, message: 'Customer Berhasil Dihapus'});
        // res.send(`Mengupdate data id ${id}`);
    } catch (err){
        next(err);
    }
    }
}
 const object = new CustomerController();

 module.exports = object;