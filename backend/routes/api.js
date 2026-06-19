
const express = require("express");
const router = express.Router();//route modular => membantu file route agar digunakan di bagian server(app.js)

const customerCtrl = require("../controllers/CustomerController");
const leadCtrl     = require('../controllers/LeadController');
const dealCtrl     = require('../controllers/DealController');
const activityCtrl     = require('../controllers/ActivityController');
const contactCtrl     = require('../controllers/ContactController');
const userCtrl     = require('../controllers/UserController');
const dashboardCtrl = require('../controllers/DashboardController');
//define route atau ketika diakses diluar maka disebut endpoint

router.get("/", (req, res)=> {
    res.send("Hello express"); 
});

router.get("/dashboard", dashboardCtrl.index);

// Customers
router.get("/customers", customerCtrl.index);
router.get("/customers/:id", customerCtrl.show);
router.post("/customers", customerCtrl.store);
router.put("/customers/:id", customerCtrl.update);
router.delete("/customers/:id", customerCtrl.destroy);

// Leads
router.get('/leads', leadCtrl.index);
router.get('/leads/:id', leadCtrl.show);
router.post('/leads', leadCtrl.store);
router.put('/leads/:id', leadCtrl.update);
router.delete("/leads/:id", leadCtrl.destroy);

// Deals
router.get('/deals', dealCtrl.index);
router.get('/deals/:id',dealCtrl.show);

// Activities
router.get('/activities', activityCtrl.index);
router.get('/activities/:id', activityCtrl.show);
router.post('/activities', activityCtrl.store);
router.put('/activities/:id', activityCtrl.update);
router.delete("/activities/:id", activityCtrl.destroy);

// Contacts
router.get('/contacts', contactCtrl.index);
router.get('/contacts/:id', contactCtrl.show);
router.post('/contacts', contactCtrl.store);
router.put('/contacts/:id', contactCtrl.update);
router.delete("/contacts/:id", contactCtrl.destroy);

module.exports = router;