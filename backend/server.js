import express from 'express';
import rutas from './routes/rutas.js';
import cors from 'cors';

const app = express();
const PORT = 3005;
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use('/api', rutas);
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
})
