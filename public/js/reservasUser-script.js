// Variables para mantener el estado de los filtros
let currentStatus = '';
let currentSalon = '';
let currentEdificio = '';

// Variables para el modal de contraseña
let reservacionABorrar = null;
const modalPassword = document.getElementById('modal-password');
const btnConfirmDelete = document.getElementById('btn-confirm-delete');
const btnCancelDelete = document.getElementById('btn-cancel-delete');
const passwordInput = document.getElementById('confirm-password');
const passwordError = document.getElementById('password-error');
const btnCerrarModalPassword = document.querySelector('.cerrar-modal-password');

// Cargar reservas y configurar eventos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Mostrar el ID del usuario
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.ID_RESPONSABLE) {
        const userIdDisplay = document.querySelector('.user-id-display');
        userIdDisplay.textContent = `ID: ${user.ID_RESPONSABLE}`;
    }

    // Cargar todas las reservas al inicio
    cargarReservas();

    // Evento para filtrar por edificio
    document.getElementById('edificio-filter').addEventListener('change', (event) => {
        currentEdificio = event.target.value;
        currentSalon = ''; // Resetear el filtro de salón cuando cambia el edificio
        document.getElementById('salon-filter').value = ''; // Resetear el select de salón
        cargarReservas(currentStatus, currentSalon, currentEdificio);
        console.log('Edificio: ' + currentEdificio);
    });

    // Evento para filtrar por salón
    document.getElementById('salon-filter').addEventListener('change', (event) => {
        currentSalon = event.target.value;
        cargarReservas(currentStatus, currentSalon, currentEdificio);
        console.log('Salón: ' + currentSalon);
    });

    // Evento para filtrar por status
    document.getElementById('status-filter').addEventListener('change', (event) => {
        currentStatus = event.target.value;
        cargarReservas(currentStatus, currentSalon, currentEdificio);
        console.log('Estatus: ' + currentStatus);
    });

    // Eventos para el modal de contraseña
    btnCerrarModalPassword.addEventListener('click', cerrarModalPassword);
    btnCancelDelete.addEventListener('click', cerrarModalPassword);
    window.addEventListener('click', (event) => {
        if (event.target === modalPassword) {
            cerrarModalPassword();
        }
    });

    // Evento para el botón de confirmar borrado
    btnConfirmDelete.addEventListener('click', async () => {
        const password = passwordInput.value;
        const user = JSON.parse(localStorage.getItem('user'));

        try {
            // Verificar la contraseña
            const response = await fetch('/verificar-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_responsable: user.ID_RESPONSABLE,
                    password: password
                })
            });

            const data = await response.json();

            if (data.success) {
                // Si la contraseña es correcta, proceder con el borrado
                const deleteResponse = await fetch(`/api/reservas/${reservacionABorrar}`, {
                    method: 'DELETE',
                });

                if (deleteResponse.ok) {
                    alert('Reserva eliminada exitosamente');
                    cerrarModalPassword();
                    location.reload();
                } else {
                    throw new Error('Error al eliminar la reserva');
                }
            } else {
                // Mostrar error si la contraseña es incorrecta
                passwordError.textContent = 'Contraseña incorrecta';
                passwordError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            passwordError.textContent = 'Error al procesar la solicitud';
            passwordError.style.display = 'block';
        }
    });
});

// Función para cargar las reservas según los filtros
async function cargarReservas(status = '', salon = '', edificio = '') {
    try {
        // Obtener el ID_RESPONSABLE del localStorage
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            throw new Error('No hay usuario en el localStorage');
        }

        const user = JSON.parse(userStr);
        const idResponsable = user.ID_RESPONSABLE;

        if (!idResponsable) {
            throw new Error('El ID_RESPONSABLE no está definido en el localStorage');
        }

        const url = `/api/reservas?id_responsable=${idResponsable}&status=${status}&salon=${salon}&edificio=${edificio}`;
        console.log('URL de la API:', url);

        // Llamar al endpoint para obtener las reservas
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al obtener las reservaciones');
        }

        const reservas = await response.json();
        console.log('Reservas obtenidas:', reservas);

        // Limpiar el contenedor de reservas
        const reservasContainer = document.getElementById('reservas-body');
        if (!reservasContainer) {
            throw new Error('No se encontró el contenedor de reservas');
        }
        reservasContainer.innerHTML = '';

        // Crear elementos de reserva
        reservas.forEach(reserva => {
            const row = document.createElement('tr');
            row.classList.add("reser-row")
            row.innerHTML = `
                <td>${reserva.ID_RESERVACION}</td>
                <td>${reserva.SALON}</td>
                <td>${reserva.EDIFICIO}</td>
                <td>${formatFecha(reserva.FECHA)}</td>
                <td>${reserva.HORARIO_ENTRADA}</td>
                <td>${reserva.HORARIO_SALIDA}</td>
                <td>${reserva.ASUNTO}</td>
                <td>${reserva.STATUS}</td>
                <td>
                    <div class="action-buttons">
                        ${reserva.STATUS === 'Pendiente' ? `
                            <button class="btn-complete" title="Completar reservación">
                                <i class='bx bx-check-circle'></i>
                            </button>
                        ` : ''}
                        <button class="btn-delete" title="Eliminar reservación">
                            <i class='bx bx-trash'></i>
                        </button>
                    </div>
                </td>
            `;

            // Hacer la fila clicable excepto los botones
            const deleteBtn = row.querySelector('.btn-delete');
            const completeBtn = row.querySelector('.btn-complete');

            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que se abra el modal
                borrarReserva(reserva.ID_RESERVACION);
            });

            if (completeBtn) {
                completeBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evitar que se abra el modal
                    completarReserva(reserva);
                });
            }

            // El resto de la fila abre el modal
            row.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-delete') && !e.target.closest('.btn-complete')) {
                    mostrarModalCompletar(reserva);
                }
            });

            reservasContainer.appendChild(row);
        });

        // Actualizar los dropdowns si no están ya poblados
        const edificioFilter = document.getElementById('edificio-filter');
        const salonFilter = document.getElementById('salon-filter');

        // Actualizar dropdown de edificios
        if (edificioFilter.options.length <= 1) {
            const edificios = [...new Set(reservas.map(r => r.EDIFICIO))];
            edificios.sort().forEach(edificio => {
                const option = document.createElement('option');
                option.value = edificio;
                option.textContent = edificio;
                edificioFilter.appendChild(option);
            });
        }

        // Actualizar dropdown de salones basado en el edificio seleccionado
        salonFilter.innerHTML = '<option value="">Todos los salones</option>';
        const salonesFiltrados = edificio 
            ? reservas.filter(r => r.EDIFICIO === edificio)
            : reservas;
        const salones = [...new Set(salonesFiltrados.map(r => r.SALON))];
        salones.sort().forEach(salon => {
            const option = document.createElement('option');
            option.value = salon;
            option.textContent = salon;
            salonFilter.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar las reservas:', error);
    }
}

//---------------------------------- var-search -----------------------------------

document.addEventListener("keyup", e => {
    if (e.target.matches("#search")) {
        document.querySelectorAll('.reser-row').forEach(button => {
            button.textContent.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                ?
                button.classList.remove("filter") : button.classList.add("filter")
        });
    }
});


//---------------------------------- Formate0 de fecha --------------------------------------

function formatFecha(fechaISO) {
    // Crear un objeto Date a partir de la fecha en formato ISO
    const date = new Date(fechaISO);

    // Extraer día, mes y año
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
    const year = date.getFullYear();

    // Formatear la fecha como d-m-y
    return `${day}-${month}-${year}`;
}



//------------------------------------- Panel de status -------------------------------------------


// Función para mostrar el modal con los detalles de la reserva
function mostrarModalCompletar(reserva) {
    const modal = document.getElementById('modal-completar');

    // Mostrar los detalles de la reserva en el modal
    document.getElementById('reserva-id').textContent = reserva.ID_RESERVACION;
    document.getElementById('reserva-salon').textContent = reserva.SALON;
    document.getElementById('reserva-edificio').textContent = reserva.EDIFICIO;
    document.getElementById('reserva-fecha').textContent = formatFecha(reserva.FECHA);
    document.getElementById('reserva-entrada').textContent = reserva.HORARIO_ENTRADA;
    document.getElementById('reserva-salida').textContent = reserva.HORARIO_SALIDA;
    document.getElementById('reserva-asunto').textContent = reserva.ASUNTO;
    document.getElementById('reserva-status').textContent = reserva.STATUS;

    // Mostrar el modal
    modal.style.display = 'flex';

    // Botón para completar la reserva
    const btnCompletar = document.getElementById('btn-completar');
    if (reserva.STATUS == 'completada') {
        btnCompletar.style.display = 'none'
    } else {
        btnCompletar.style.display = 'block';
        btnCompletar.onclick = () => completarReserva(reserva);
    }

    // Botón para borrar la reserva
    const btnBorrar = document.getElementById('btn-borrar');
    btnBorrar.onclick = () => borrarReserva(reserva.ID_RESERVACION);
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('modal-completar');
    modal.style.display = 'none';
}

// Evento para cerrar el modal al hacer clic en la "X"
document.querySelector('.cerrar-modal').addEventListener('click', cerrarModal);

// Evento para cerrar el modal al hacer clic fuera del contenido
window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal-completar');
    if (event.target === modal) {
        cerrarModal();
    }
});


// --------------------------- Función para completar la reserva ------------------------------------
async function completarReserva(reserva) {
    try {
        // Hacer la solicitud PUT al backend


        const response = await fetch(`/api/reservas/${reserva.ID_RESERVACION}/completar`, {
            method: 'PUT',
        });

        if (response.ok) {
            alert('Reserva completada exitosamente');
            cerrarModal(); // Ocultar el modal
            location.reload();
        } else {
            alert('Error al completar la reserva');
        }


    } catch (error) {
        console.error('Error al completar la reserva:', error);
    }
}


// Modificar la función borrarReserva para mostrar el modal de contraseña
async function borrarReserva(idReservacion) {
    mostrarModalPassword(idReservacion);
}

// Función para mostrar el modal de contraseña
function mostrarModalPassword(idReservacion) {
    reservacionABorrar = idReservacion;
    modalPassword.style.display = 'flex';
    passwordInput.value = ''; // Limpiar el input
    passwordError.style.display = 'none'; // Ocultar mensaje de error
}

// Función para cerrar el modal de contraseña
function cerrarModalPassword() {
    modalPassword.style.display = 'none';
    reservacionABorrar = null;
}