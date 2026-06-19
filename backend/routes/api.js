
const express = require("express");
const router = express.Router();//route modular => membantu file route agar digunakan di bagian server(app.js)

const customerCtrl = require("../controllers/CustomerController");
const leadCtrl     = require('../controllers/LeadController');
const dealCtrl     = require('../controllers/DealController');
const activityCtrl     = require('../controllers/ActivityController');
const contactCtrl     = require('../controllers/ContactController');
const userCtrl     = require('../controllers/UserController');
//define route atau ketika diakses diluar maka disebut endpoint

router.get("/", (req, res)=> {
    res.send("Hello express"); 
});

router.get("/customers", customerCtrl.index);
router.get("/customers/:id", customerCtrl.show);

// Leads
router.get('/leads',         leadCtrl.index);
router.get('/leads/:id',     leadCtrl.show);
 
// Deals
router.get('/deals',         dealCtrl.index);
router.get('/deals/:id',     dealCtrl.show);

// Activities
router.get('/activities',         activityCtrl.index);
router.get('/activities/:id',     activityCtrl.show);

// Contacts
router.get('/contacts',         contactCtrl.index);
router.get('/contacts/:id',     contactCtrl.show);

// Users
router.get('/users',         userCtrl.index);
router.get('/users/:id',     userCtrl.show);

module.exports = router;