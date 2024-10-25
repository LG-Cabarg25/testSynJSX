import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuración del almacenamiento de multer
const storage = multer.diskStorage({
  // Directorio donde se guardarán los archivos subidos
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    
    // Verifica si el directorio existe, si no, lo crea
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir);
    }
    
    cb(null, uploadDir); // Define el directorio donde se guardarán los archivos
  },
  // Definir el nombre del archivo
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filtro para validar el tipo de archivo
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|pdf|docx/; // Tipos de archivo permitidos
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Tipo de archivo no permitido.'));
  }
};

// Inicializar multer con la configuración de almacenamiento y filtros
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Límite de tamaño de archivo (10MB en este caso)
  fileFilter: fileFilter
});

export default upload;
