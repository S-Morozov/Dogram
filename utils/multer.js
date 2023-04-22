const multer = require('multer');

// piettää kuvalle vanhan nimen
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    const filename = file.originalname || new Date().toISOString();
    callback(null, filename);
  }
});
const uploadMiddleware = multer({ storage });

module.exports = uploadMiddleware;