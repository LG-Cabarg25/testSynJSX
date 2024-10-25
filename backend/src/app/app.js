import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa fileURLToPath

// Import routes 
import userRouter from '../route/userRoute.js';
import projectRoute from '../route/projectRoute.js';
import meetingRoute from '../route/meetingRoute.js';
import projectAssignmentsRoute from '../route/projectAssignmentsRoute.js';
import testPlansRoute from '../route/testPlansRoute.js';
import testCasesRoute from '../route/testCasesRoute.js';
import testImagesRoute from '../route/testImagesRoute.js';
import testCommentsRoute from '../route/testCommentsRoute.js';
import projectAssignmentsCommentsRoute from '../route/projectAssignmentsCommentsRoute.js';
import defectRoute from '../route/defectRoute.js'


const app = express();

app.use(cors());

const corsOptions = {
    origin: 'http://localhost:5173', // Reemplaza con el dominio permitido
    methods: 'GET,POST,PUT,DELETE', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type,Authorization, x-access-token', // Headers permitidos
  };
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

// Obtiene el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// Use routes 
app.use('/api/user', userRouter);
app.use('/api/project', projectRoute);
app.use('/api/meeting', meetingRoute);
app.use('/api/project-assignments', projectAssignmentsRoute);
app.use('/api/project-assignments-comments', projectAssignmentsCommentsRoute);
app.use('/api/test-plans', testPlansRoute);
app.use('/api/test-cases', testCasesRoute);
app.use('/api/test-images', testImagesRoute);
app.use('/api/test-comments', testCommentsRoute);
app.use('/api/defects', defectRoute);


export default app;
