const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ success: false, message: 'Data sudah ada, tidak boleh duplikat' });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ success: false, message: 'Data relasi yang dipilih tidak ditemukan' });
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(409).json({ success: false, message: 'Data masih dipakai oleh data lain' });
  }

  res.status(500).json({ success: false, message: err.message });
};

module.exports = errorHandler;
