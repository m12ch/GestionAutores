// CONSULTAS A LA BASE DE DATOS

import pool from '../config/db.js';

export const obtenerTodoDatos=async()=>{
    const [array]=await pool.query('SELECT * FROM autor');
    return array;
}
export const crearNuevos=async(nombre, nacionalidad, fecha_nacimiento, biografia)=>{
    const [resultado]=await pool.query('INSERT INTO autor(nombre, nacionalidad, fecha_nacimiento, biografia) VALUES(?,?,?,?)', [nombre, nacionalidad, fecha_nacimiento, biografia]);
    return resultado.insertId;
}
export const editarDatos = async(id_autor, nombre, nacionalidad, fecha_nacimiento, biografia) => {
    await pool.query(
      'UPDATE autor SET nombre=?, nacionalidad=?, fecha_nacimiento=?, biografia=? WHERE id_autor=?', 
      [nombre, nacionalidad, fecha_nacimiento, biografia, id_autor]
    );
  }
  
export const BuscarRegistro = async(id_autor) => {
    const [array] = await pool.query('SELECT * FROM autor WHERE id_autor=?', [id_autor]);
    return array[0];
  }
export const eliminarRegistro = async (id_autor) => {
    await pool.query('DELETE FROM autor WHERE id_autor = ?', [id_autor]);
}

export const obtenerLibrosPorAutor = async (id_autor) => {
    const [libros] = await pool.query(
      'SELECT * FROM libros WHERE id_autor = ?', 
      [id_autor]
    );
    return libros;
}
  