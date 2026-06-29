const NotificationModel = require("../models/NotificationModel");

class NotificationController {
  async index(req, res) {
    try {
      const data = await NotificationModel.findAll(req.user.id);
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async store(req, res) {
    try {
      const { user_id, message, action_url } = req.body;

      if (!user_id || !message) {
        return res.status(400).json({
          success: false,
          message: "user_id dan message wajib diisi",
        });
      }

      const insertId = await NotificationModel.create(user_id, message, action_url);
      return res.status(201).json({
        success: true,
        message: "Notification created",
        data: { id: insertId },
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async markRead(req, res) {
    try {
      await NotificationModel.markAsRead(req.params.id, req.user.id);
      return res.json({ success: true, message: "Marked as read" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new NotificationController();
