const multer = require("multer");

//filesystem interno per archivio immagini interno
const internalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() + 1E9);
        const fileExtension = file.originalname.split(".").pop()
        // cb(null, `${file.fieldname}-${new Date().toISOString()}.${fileExtension}`)
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`)
    }
})

module.exports = {internalStorage};