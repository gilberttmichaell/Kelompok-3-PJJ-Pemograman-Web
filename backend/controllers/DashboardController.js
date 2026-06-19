const DashboardModel = require('../models/DashboardModel');
class DashboardController{
    async index(req, res, next){
        try{
            const data = await DashboardModel.getSummary();
            res.json({succes: true, data});

        } catch (err){
            next(err);
        }
    }
}

const object = new DashboardController();

module.exports = object;