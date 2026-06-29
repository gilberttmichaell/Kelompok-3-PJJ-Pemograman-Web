const MessageModel = require("../models/MessageModel");
const NotificationModel = require("../models/NotificationModel");

class MessageController {
  async index(req, res) {
    try {
      const data = await MessageModel.findAllForUser(req.user.id);
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async store(req, res) {
    try {
      const senderId = req.user.id;
      const { receiver_id, message } = req.body;

      if (!receiver_id || !message) {
        return res.status(400).json({
          success: false,
          message: "receiver_id dan message wajib diisi",
        });
      }

      const insertId = await MessageModel.create(senderId, receiver_id, message);
      await NotificationModel.create(
        receiver_id,
        `Pesan baru dari ${req.user.name || "user"}`,
        "/messages"
      );

      return res.status(201).json({
        success: true,
        message: "Message sent",
        data: { id: insertId },
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  async read(req, res) {
    try {
      await MessageModel.markAsRead(req.params.id, req.user.id);
      return res.json({ success: true, message: "Message marked as read" });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new MessageController();
