import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDuenos, deleteDueno, updateDueno, createDueno } from '../features/duenosSlice';
import { Modal, Button } from 'react-bootstrap';  // Importando Modal de react-bootstrap
import Swal from "sweetalert2";

const CompShowDuenos = () => {
    const dispatch = useDispatch();
    const duenos = useSelector((state) => state.duenos.duenos);
    const status = useSelector((state) => state.duenos.status);

    const [showModalCreate, setShowModalCreate] = useState(false);  // Estado para controlar el modal de creación
    const [showModalUpdate, setShowModalUpdate] = useState(false);  // Estado para controlar el modal de actualización


    const [duenoToUpdate, setDuenoToUpdate] = useState(null);  // Estado para almacenar el dueno a editar


    // Definimos los estados para los campos del formulario
    const [nomdueCreate, setNomdueCreate] = useState('');
    const [teldueCreate, setTeldueCreate] = useState('');
    const [dirdueCreate, setDirdueCreate] = useState('');
    const [cordueCreate, setCordueCreate] = useState('');
    const [errors, setErrors] = useState({});

    // Funciones de validación
    const validateName = () => {
        const nameRegex = /^[A-Za-záéíóúÁÉÍÓÚ\s]*$/;
        if (!nameRegex.test(nomdueCreate)) { // Validación usando la regex
            setErrors(prev => ({ ...prev, name: "El nombre debe contener solo letras y espacios." }));
        } else {
            setErrors(prev => ({ ...prev, name: "" }));  // Limpiar error si es válido
        }
    };

    const validatePhone = () => {
        const phoneRegex = /^[0-9]{10}$/; // Asegúrate de que el teléfono tenga exactamente 10 dígitos
        if (!teldueCreate || !phoneRegex.test(teldueCreate)) {
            setErrors(prev => ({ ...prev, phone: "El teléfono debe contener 10 dígitos." }));
        } else {
            setErrors(prev => ({ ...prev, phone: "" })); // Limpia el error si es válido
        }
    };

    const validateAddress = () => {
        if (!dirdueCreate) {
            setErrors(prev => ({ ...prev, address: "La dirección no puede estar vacía." }));
        } else {
            setErrors(prev => ({ ...prev, address: "" }));
        }
    };

    const validateEmail = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zAZ]{2,6}$/;
        if (!cordueCreate || !emailRegex.test(cordueCreate)) {
            setErrors(prev => ({ ...prev, email: "El correo debe tener un formato válido." }));
        } else {
            setErrors(prev => ({ ...prev, email: "" }));
        }
    };

    const isFormInvalid = (nomdue, teldue, dirdue, cordue) => {
        return !nomdue || !teldue || !dirdue || !cordue; // Devuelve true si falta algún campo
    };


    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDuenos());
        }
    }, [dispatch, status]);

    // Función para abrir el modal de creación
    const abrirModalCrear = () => {
        setShowModalCreate(true);
    };


    const abrirModalActualizar = (dueno) => {
        setDuenoToUpdate(dueno);
        setNomdueUpdate(dueno.nomdue);
        setTeldueUpdate(dueno.teldue);
        setDirdueUpdate(dueno.dirdue);
        setCordueUpdate(dueno.cordue);
        setShowModalUpdate(true);
    };
    

    // Acción para crear un nuevo dueño 
    const crearDueno = (e) => {
        e.preventDefault(); // Evita que el formulario se recargue al enviar

        try {
            // Crear el objeto con los datos del formulario
            const duenoData = {
                nomdue: nomdueCreate,
                teldue: teldueCreate,
                dirdue: dirdueCreate,
                cordue: cordueCreate,
            };

            // Llamar a la acción dispatch para crear el dueño
            dispatch(createDueno(duenoData));

            // Limpia los campos del formulario
            setNomdueCreate('');
            setTeldueCreate('');
            setDirdueCreate('');
            setCordueCreate('');
            setShowModalCreate(false); // Cerrar el modal después de crear

            // Actualizar la lista de dueños
            dispatch(fetchDuenos());

            // SweetAlert2: éxito
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'El dueño ha sido creado correctamente.',
                confirmButtonText: 'Aceptar',
            });
        } catch (error) {
            // SweetAlert2: error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al crear el dueño.',
                confirmButtonText: 'Aceptar',
            });
            console.error("Error al crear el dueño:", error);
        }
    };


    <Modal show={showModalCreate} onHide={() => setShowModalCreate(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
            <Modal.Title>Crear Nuevo Dueño</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={crearDueno}> {/* Llamar a crearDueno al enviar */}
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nomdueCreate}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^[A-Za-záéíóúÁÉÍÓÚ\s]*$/.test(value)) {
                                setNomdueCreate(value);
                            }
                            validateName();
                        }}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        value={teldueCreate}
                        onChange={(e) => {
                            const newValue = e.target.value.replace(/\D/g, ''); // Eliminar cualquier carácter no numérico
                            setTeldueCreate(newValue);
                            validatePhone();
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input
                        type="text"
                        className="form-control"
                        value={dirdueCreate}
                        onChange={(e) => {
                            setDirdueCreate(e.target.value);
                            validateAddress();
                        }}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Correo</label>
                    <input
                        type="email"
                        className="form-control"
                        value={cordueCreate}
                        onChange={(e) => {
                            setCordueCreate(e.target.value);
                            validateEmail();
                        }}
                    />
                </div>

                <Button variant="primary" type="submit">
                    Crear
                </Button>
            </form>
        </Modal.Body>
    </Modal>



const [nomdueUpdate, setNomdueUpdate] = useState('');
const [teldueUpdate, setTeldueUpdate] = useState('');
const [dirdueUpdate, setDirdueUpdate] = useState('');
const [cordueUpdate, setCordueUpdate] = useState('');

const actualizarDueno = (e) => {
    e.preventDefault();
    if (!duenoToUpdate || !duenoToUpdate._id) {
        console.error('No se encontró el dueño a actualizar');
        return;
    }

    dispatch(updateDueno({
        _id: duenoToUpdate._id,
        nomdue: nomdueUpdate,
        teldue: teldueUpdate,
        dirdue: dirdueUpdate,
        cordue: cordueUpdate,
    }))
    .unwrap()
    .then(() => {
        Swal.fire('¡Éxito!', 'El dueño ha sido actualizado correctamente.', 'success');
        dispatch(fetchDuenos()); // Refresca los datos
        setShowModalUpdate(false); // Cierra el modal
    })
    .catch((error) => {
        Swal.fire('Error', 'Hubo un problema al actualizar el dueño.', 'error');
        console.error('Error al actualizar:', error);
    });
};



return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-10 col-lg-8">
            <Button variant="primary" onClick={abrirModalCrear} className="mb-3">
                <i className="fas fa-plus"></i> Crear
            </Button>

            <div className="table-responsive">
                <table className="table table-bordered shadow-sm rounded">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Dirrección</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {duenos.map((dueno, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{dueno.nomdue}</td>
                                <td>{dueno.teldue}</td>
                                <td>{dueno.dirdue}</td>
                                <td>{dueno.cordue}</td>
                                <td>
                                    <div className="d-flex justify-content-start">
                                        <button
                                            onClick={() => abrirModalActualizar(dueno)}
                                            className="btn btn-warning me-2"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => dispatch(deleteDueno(dueno._id))}
                                            className="btn btn-danger"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modal de creación de dueno */}
        <Modal show={showModalCreate} onHide={() => setShowModalCreate(false)} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Crear Nuevo Dueño</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={crearDueno}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={nomdueCreate} // Usando el estado adecuado para nombre
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[A-Za-záéíóúÁÉÍÓÚ\s]*$/.test(value)) { // Solo permitir letras y espacios
                                    setNomdueCreate(value);  // Actualiza el valor solo si es válido
                                }
                                validateName();  // Validación en cada cambio
                            }} // Función para actualizar el estado y validar en tiempo real
                        />
                        {errors.name && <div className="error-message">{errors.name}</div>} {/* Mensaje de error si es inválido */}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Teléfono</label>
                        <input
                            type="text"
                            className="form-control"
                            value={teldueCreate} // Usando el estado adecuado para teléfono
                            onChange={(e) => {
                                // Solo actualizar el estado si el valor contiene solo números
                                const newValue = e.target.value.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
                                setTeldueCreate(newValue);  // Actualiza el estado con solo números
                                validatePhone();  // Valida el teléfono
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            className="form-control"
                            value={dirdueCreate} // Usando el estado adecuado para dirección
                            onChange={(e) => {
                                setDirdueCreate(e.target.value)
                                validateAddress()
                            }} // Función para actualizar el estado
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Correo</label>
                        <input
                            type="email"
                            className="form-control"
                            value={cordueCreate} // Usando el estado adecuado para correo
                            onChange={(e) => {
                                setCordueCreate(e.target.value)
                                validateEmail()
                            }} // Función para actualizar el estado
                        />
                    </div>
                    <button type="submit" className='btn btn-primary' disabled={isFormInvalid(nomdueCreate, teldueCreate, dirdueCreate, cordueCreate)}>
                        Guardar
                    </button>
                </form>
            </Modal.Body>
        </Modal>


        {/* Modal de actualización de dueno */}
        <Modal show={showModalUpdate} onHide={() => setShowModalUpdate(false)} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Actualizar Dueno</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form onSubmit={actualizarDueno}>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={nomdueUpdate} // Usando el estado adecuado para nombre
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^[A-Za-záéíóúÁÉÍÓÚ\s]*$/.test(value)) { // Solo permitir letras y espacios
                                    setNomdueUpdate(value);  // Actualiza el valor solo si es válido
                                }
                                validateName();  // Validación en cada cambio
                            }} // Función para actualizar el estado y validar en tiempo real
                        />
                        {errors.name && <div className="error-message">{errors.name}</div>} {/* Mensaje de error si es inválido */}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Teléfono</label>
                        <input
                            type="text"
                            className="form-control"
                            value={teldueUpdate} // Usando el estado adecuado para teléfono
                            onChange={(e) => {
                                // Solo actualizar el estado si el valor contiene solo números
                                const newValue = e.target.value.replace(/\D/g, ''); // Elimina cualquier carácter no numérico
                                setTeldueUpdate(newValue);  // Actualiza el estado con solo números
                                validatePhone();  // Valida el teléfono
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Dirección</label>
                        <input
                            type="text"
                            className="form-control"
                            value={dirdueUpdate} // Usando el estado adecuado para dirección
                            onChange={(e) => {
                                setDirdueUpdate(e.target.value)
                                validateAddress()
                            }} // Función para actualizar el estado
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Correo</label>
                        <input
                            type="email"
                            className="form-control"
                            value={cordueUpdate} // Usando el estado adecuado para correo
                            onChange={(e) => {
                                setCordueUpdate(e.target.value)
                                validateEmail()
                            }} // Función para actualizar el estado
                        />
                    </div>
                    <button type="submit" className='btn btn-primary' disabled={isFormInvalid(nomdueUpdate, teldueUpdate, dirdueUpdate, cordueUpdate)}>
                        Actualizar
                    </button>
                </form>
            </Modal.Body>
        </Modal>

    </div>

);
}


export default CompShowDuenos
