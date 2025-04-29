import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useCallback, useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from 'sweetalert2';
import { ListGroup } from 'react-bootstrap';

function App() {
  const [autor, setAutor] = useState([]);
  /*VARIABLES PARA EL MODAL */
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [mostrar, setMostrar] = useState(false);
  const cerrarModal = () => setMostrar(false);
  const abrirModal = () => setMostrar(true);
  const [autorId, setAutorId] = useState(null);
  /*VARIABLES PARA EL MODAL */
  const [formularioAgregar, setFormularioAgregar] = useState({
    nombre: '',
    nacionalidad: '',
    fecha_nacimiento: '',
    biografia: ''
  });
  const [FormularioEditar, setEditarAutor] = useState({
    nombre: '',
    nacionalidad: '',
    fecha_nacimiento: '',
    biografia: ''
  });
  /*FUNCION PARA OBTEENR LOS DATOS DE LA BASE DE DATOS*/
  const fetchData = useCallback( async() => {
    try{
      const respuesta = await fetch('http://localhost:3005/api/autor');
      const data = await respuesta.json();
      setAutor(data);//almacena informacion de los datos

    }catch(error){
      alert('ERROR'+error);
    }
  },[]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  

  /*FUNCION PARA AGREGAR */
  const agregar = async(e) =>{
    e.preventDefault();
    if(!formularioAgregar.nombre.trim() || !formularioAgregar.nacionalidad.trim() || !formularioAgregar.fecha_nacimiento.trim() || !formularioAgregar.biografia.trim()){
      Swal.fire({
        title: "Por Favor Complete los campos",
        text: "No se puede dejar campos vacios",
        icon: "warning",
        timer: 3000
      });
      return;
    }
    try{
      const respuesta = await fetch('http://localhost:3005/api/autor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formularioAgregar
        })
      });
      if(!respuesta.ok){
        let errormessage = 'Error al agregar el Autor';
        try{
          const error = await respuesta.json();
          errormessage = error.message || errormessage;
        }catch(error){
          console.error(error);
        }
        throw new Error(errormessage);
      }
      handleClose();
      Swal.fire({
        title: "Agregado Correctamente",
        icon: "success",
        draggable: true,
        timer: 2000
      });
      fetchData();
      setFormularioAgregar({
        nombre: '',
        nacionalidad: '',
        fecha_nacimiento: '',
        biografia: ''
      });
    }catch(error){
      console.error('Error al agregar el Autor:', error); 
      Swal.fire({
        title: "NO se pudo Agregar Correctamente",
        icon: "error",
        draggable: true,
        timer: 2000
      });
    }
  }
  const cambiosFormularioAgregar = (e) => {
    setFormularioAgregar({
      ...formularioAgregar,//realiza un copia del campo
      [e.target.name]: e.target.value
    })
    
  }

  /*FUNCION PARA EDITAR REGISTRO*/
  
  const EditarRegistro = (autor) => {
    setEditarAutor({
      ...autor,
      fecha_nacimiento: formatDate(autor.fecha_nacimiento) || ''
    });
    setAutorId(autor.id_autor);
    abrirModal();
  }
  const cambioFormularioEditar = (e) =>{
    setEditarAutor({
      ...FormularioEditar,
      [e.target.name]: e.target.value
    });
  }
  /*FUNCION PARA EDITAR*/
  const editarAut = async(e) =>{
    e.preventDefault();
    if(!FormularioEditar.nombre.trim() || !FormularioEditar.nacionalidad.trim() || !FormularioEditar.fecha_nacimiento.toString().trim() || !FormularioEditar.biografia.trim()){
      Swal.fire({
        title: "Por Favor Complete los campos",
        text: "No se puede dejar campos vacios",
        icon: "warning",
        timer: 3000
      });
      return;
    }
    const datosAEnviar = {
      ...FormularioEditar,
      fecha_nacimiento: new Date(FormularioEditar.fecha_nacimiento).toISOString()
    };
  
    try {
      const respuesta = await fetch(`http://localhost:3005/api/autor/${autorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });
      if(!respuesta.ok){
        let errormessage = 'Error al editar el autor';
        try{
          const error = await respuesta.json();
          errormessage = error.message || errormessage;
        }catch(error){
          console.error(error);
        }
        throw new Error(errormessage);
      }
      cerrarModal();
      Swal.fire({
        title: "Editado Correctamente",
        icon: "success",
        draggable: true,
        timer: 2000
      });
      fetchData();
    }catch(error){
      console.error('Error al guardar el autor editado:', error); 
      Swal.fire({
        title: "NO se pudo Editar Correctamente, error al guardar",
        icon: "error",
        draggable: true,
        timer: 2000
      });
    }
  }

  /*FUNCION PARA ELIMINAR REGISTRO*/
  const EliminarRegistro = async(id_autor) =>{
    Swal.fire({
      title: "Estas seguro de ELIMINAR este registro?",
      text: "No podras deshacer esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SI, eliminar!",
      cancelButtonText: "Cancelar"
    }).then(async(result) =>{
      if(result.isConfirmed){
        try{
          await fetch(`http://localhost:3005/api/autor/${id_autor}`, {
            method: 'DELETE'
          });
          Swal.fire({
            title: "ELIMINADO correctamente!",
            text: "el registro a sido eliminado.",
            icon: "success",
            timer: 2000
          });
          fetchData();
        }catch(error){
          Swal.fire({
            title: "No se pudo ELIMINAR el producto!",
            icon: "warning",
            timer: 2000
          });
        }
      }
    });
  }
  /*FUNCION PARA CAMBIAR FORMATO FECHA NACIMIENTO */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  //modal para libros
  const [showLibros, setShowLibros] = useState(false);
  const [librosAutor, setLibrosAutor] = useState([]);
  const [autorSeleccionado, setAutorSeleccionado] = useState(null);

  const handleCloseLibros = () => setShowLibros(false);
  const handleShowLibros = () => setShowLibros(true);

  const obtenerLibrosAutor = async (id_autor, nombreAutor) => {
    try {
      const respuesta = await fetch(`http://localhost:3005/api/autor/${id_autor}/libros`);
      const data = await respuesta.json();
      setLibrosAutor(data);
      setAutorSeleccionado(nombreAutor);
      handleShowLibros();
    } catch (error) {
      console.error('Error al obtener libros:', error);
      Swal.fire({
        title: "Error",
        text: "No se pudieron obtener los libros",
        icon: "error"
      });
    }
  }

  return (
    <div className="App">
      <h2>Gestión de Autores</h2>
     
      

      {/* TABLA */}
      <div className='tabla'>
        {/* Button to open the modal */}
        <Button className="boton-crear" variant="success" onClick={handleShow}>
        Crear Registro
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Registro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre"
                  name='nombre'
                  value={formularioAgregar.nombre}
                  onChange={cambiosFormularioAgregar}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Nacionalidad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nacionalidad"
                  name='nacionalidad'
                  value={formularioAgregar.nacionalidad}
                  onChange={cambiosFormularioAgregar}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Fecha Nacimineto</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Fecha Nacimineto"
                  name='fecha_nacimiento'
                  value={formularioAgregar.fecha_nacimiento}
                  onChange={cambiosFormularioAgregar}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Biografia</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Biografia"
                  name='biografia'
                  value={formularioAgregar.biografia}
                  onChange={cambiosFormularioAgregar}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          {/*BOTONES DEL MODAL PARA CREAR REGISTRO*/}
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={agregar}>
                Guardar Cambios
              </Button>
            </Modal.Footer>
        </Modal>

        {/*MODAL PARA EDITAR REGISTRO*/}
        <Modal show={mostrar} onHide={cerrarModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Registro</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre"
                  name='nombre'
                  value={FormularioEditar.nombre}
                  onChange={cambioFormularioEditar}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Nacionalidad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nacionalidad"
                  name='nacionalidad'
                  value={FormularioEditar.nacionalidad}
                  onChange={cambioFormularioEditar}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Fecha Nacimineto</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Fecha Nacimiento"
                  name='fecha_nacimiento'
                  value={FormularioEditar.fecha_nacimiento}
                  onChange={cambioFormularioEditar}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Biografia</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Biografia"
                  name='biografia'
                  value={FormularioEditar.biografia}
                  onChange={cambioFormularioEditar}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          {/*BOTONES DEL MODAL PARA CREAR REGISTRO*/}
            <Modal.Footer>
              <Button variant="secondary" onClick={cerrarModal}>
                Cerrar
              </Button>
              <Button variant="primary" onClick={editarAut}>
                Guardar Cambios
              </Button>
            </Modal.Footer>
        </Modal>

      {/*Modal para ver los libros */}
        <Modal show={showLibros} onHide={handleCloseLibros}>
        <Modal.Header closeButton>
          <Modal.Title>Libros de {autorSeleccionado}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {librosAutor.length > 0 ? (
            <ListGroup>
              {librosAutor.map(libro => (
                <ListGroup.Item key={libro.id_libro}>
                  <h5>{libro.titulo}</h5>
                  <p><strong>Género:</strong> {libro.genero}</p>
                  <p><strong>Año:</strong> {libro.anio_publicacion}</p>
                  <p><strong>Resumen:</strong> {libro.resumen}</p>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>Este autor no tiene libros registrados.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLibros}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>





        <Table striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Nombre</th>
              <th>Nacionalidad</th>
              <th>Fecha Nacimiento</th>
              <th>Biografia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {autor.map(aut=>(
              <tr key={aut.id_autor}>
                <td>{aut.id_autor}</td>
                <td>{aut.nombre}</td>
                <td>{aut.nacionalidad}</td>
                <td>{formatDate(aut.fecha_nacimiento)}</td>
                <td>{aut.biografia}</td>
                <td>
                <ButtonGroup aria-label="Basic example">
                  <Button variant="warning" className="boton-ver me-2 rounded-pill d-flex align-items-center gap-2" onClick={()=>{obtenerLibrosAutor(aut.id_autor, aut.nombre)}}>
                    <span>Ver Libro</span>
                    <FaRegEdit />
                  </Button>
                  <Button variant="warning" className="boton-editar me-2 rounded-pill d-flex align-items-center gap-2" onClick={()=>{EditarRegistro(aut)}}>
                    <span>Editar</span>
                    <FaRegEdit />
                  </Button>
                  <Button variant="danger" className="boton-eliminar rounded-pill d-flex align-items-center gap-2" onClick={()=>{EliminarRegistro(aut.id_autor)}}>
                    <span>Eliminar</span>
                    <MdDelete />
                  </Button>
                </ButtonGroup>
                </td>
              </tr>
            ))}
            
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default App;
