const express = require("express");
const router = express.Router();

const CustomerController = require("../controllers/CustomerControllers");
const UserController     = require("../controllers/UserController");
const leadController     = require("../controllers/LeadController");
const dealController     = require("../controllers/DealController");
const ActivityController = require("../controllers/ActivityController");
const ContactController  = require("../controllers/ContactController");
const DashboardController= require("../controllers/DashboardController");
const AuthController     = require("../controllers/AuthController");
const NotificationController = require("../controllers/NotificationController");
const MessageController  = require("../controllers/MessageController");
const auth               = require("../middleware/auth");
const authorize          = require("../middleware/authorize");

router.get("/", (req, res) => {
  res.send("Hello express");
});

// ===== Auth (publik) =====
router.post("/register", (req, res) => AuthController.register(req, res));
router.post("/login", (req, res) => AuthController.login(req, res));

// ===== Dashboard (semua yang login) =====
router.get("/dashboard", auth, (req, res) => DashboardController.index(req, res));

// ===== Notifications & Messages =====
router.get("/notifications", auth, NotificationController.index);
router.post("/notifications", auth, authorize('admin'), NotificationController.store);
router.put("/notifications/:id/read", auth, NotificationController.markRead);

router.get("/messages", auth, MessageController.index);
router.post("/messages", auth, MessageController.store);
router.put("/messages/:id/read", auth, MessageController.read);

// ===== Users =====
// GET dibuka untuk user login agar fitur Messages bisa memilih penerima.
// Create/update/delete tetap khusus admin.
router.get("/users",     auth, UserController.index);
router.get("/users/:id", auth, UserController.show);
router.post("/users", auth, authorize('admin'), UserController.store);
router.put("/users/:id", auth, authorize('admin'), UserController.update);
router.delete("/users/:id", auth, authorize('admin'), UserController.destroy);

// ===== Customers =====
router.get   ('/customers',     auth, CustomerController.index);
router.get   ('/customers/:id', auth, CustomerController.show);
router.post  ('/customers',     auth, CustomerController.store);
router.put   ('/customers/:id', auth, CustomerController.update);
router.delete('/customers/:id', auth, authorize('admin'), CustomerController.destroy); // hapus: admin

// ===== Leads =====
router.get("/leads",        auth, leadController.index);
router.get("/leads/:id",    auth, leadController.show);
router.post("/leads",       auth, leadController.store);
router.put("/leads/:id",    auth, leadController.update);
router.delete("/leads/:id", auth, authorize('admin'), leadController.destroy); // hapus: admin

// ===== Deals =====
router.get("/deals",        auth, dealController.index);
router.get("/deals/:id",    auth, dealController.show);
router.post("/deals",       auth, dealController.store);
router.put("/deals/:id",    auth, dealController.update);
router.delete("/deals/:id", auth, authorize('admin'), dealController.destroy);

// ===== Activity =====
router.get('/activities',        auth, ActivityController.index);
router.get('/activities/:id',    auth, ActivityController.show);
router.post('/activities',       auth, ActivityController.store);
router.put('/activities/:id',    auth, ActivityController.update);
router.delete('/activities/:id', auth, authorize('admin'), ActivityController.destroy);

// ===== Contact =====
router.get("/contacts",        auth, ContactController.index);
router.get("/contacts/:id",    auth, ContactController.show);
router.post("/contacts",       auth, ContactController.store);
router.put("/contacts/:id",    auth, ContactController.update);
router.delete("/contacts/:id", auth, authorize('admin'), ContactController.destroy);

module.exports = router;
