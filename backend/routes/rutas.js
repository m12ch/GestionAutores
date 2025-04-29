import { Router } from "express";
import { obtenerDatos, crearNew, actualizarNewDatos, eliminarReg, obtenerLibrosAutor } from "../controller/controlador.js";

const router= Router();
router.get('/autor', obtenerDatos);
router.post('/autor', crearNew);
router.put('/autor/:id_autor', actualizarNewDatos);
router.delete('/autor/:id_autor', eliminarReg);
router.get('/autor/:id_autor/libros', obtenerLibrosAutor);

export default router;