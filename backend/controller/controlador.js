//ENLACE CON EL MODELO

import * as Autor from '../model/modelo.js';

export const obtenerDatos = async(req, res)=>{
    try{
        const aut= await Autor.obtenerTodoDatos();
        res.status(200).json(aut);
    }catch(error){
        res.status(500).json({message:'Error al obtener los datos',message: error.message});
    }
}
export const crearNew = async(req, res)=>{
    try{
        const {nombre, nacionalidad, fecha_nacimiento, biografia} = req.body;
        const newaut = await Autor.crearNuevos(nombre, nacionalidad, fecha_nacimiento, biografia);
        res.status(201).json({id: newaut, message: 'Creado correctamente'});
    }catch(error){
        res.status(500).json({message: 'Error al caragar los datos', error: error.message})
    }
}
export const actualizarNewDatos = async(req, res) => {
    try {
      const {id_autor} = req.params;
      const {nombre, nacionalidad, fecha_nacimiento, biografia} = req.body;
      
      const aut = await Autor.BuscarRegistro(id_autor);
      if(!aut) return res.status(404).json({message: 'Dato NO encontrado'});
      
      await Autor.editarDatos(id_autor, nombre, nacionalidad, fecha_nacimiento, biografia);
      res.status(200).json({message: 'Actualizado correctamente'});
    } catch(error) {
      console.error(error);
      res.status(500).json({message: 'Error al actualizar los datos', error: error.message})
    }
  }
  export const eliminarReg = async (req, res) => {
    try {
      const { id_autor } = req.params;
      const buscar = await Autor.BuscarRegistro(id_autor);
      
      if (!buscar) {
        return res.status(404).json({ message: 'Registro NO encontrado' });
      }
      
      await Autor.eliminarRegistro(id_autor);
      res.status(200).json({ message: 'Registro eliminado correctamente' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el registro', error: error.message });
    }
  }
  export const obtenerLibrosAutor = async (req, res) => {
    try {
      const { id_autor } = req.params;
      const libros = await Autor.obtenerLibrosPorAutor(id_autor);
      res.status(200).json(libros);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener libros', error: error.message });
    }
  }