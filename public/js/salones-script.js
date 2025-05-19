//---------------------- EDIFICIOS ------------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/edificios');
        var edificios = await response.json();

        // Obtener el elemento select en el HTML
        const edificioSelect = document.getElementById('building-filter');

        // Agregar las opciones de edificios al select
        edificios.forEach(edificio => {
            const option = document.createElement('option');
            option.value = edificio.ID_EDIFICIO;
            option.textContent = edificio.NOMBRE;
            edificioSelect.appendChild(option);
        });

        // Cargar todos los salones al principio
        const responseSalones = await fetch('/api/salones'); // Sin filtro
        const salones = await responseSalones.json();

        // Limpiar el contenedor de salones
        const salonesContainer = document.getElementById('salonesContainer');
        salonesContainer.innerHTML = '';

        // Agregar los salones al contenedor
        salones.forEach(salon => {
            const button = document.createElement('button');
            button.classList.add('invisibleButton');
            button.innerHTML = `
                <li>
                    <i class='bx bx-code-block' style='color:#4daadb'></i>
                    <span class="text">
                        <h3>${salon.ID_SALON}</h3>
                        <p>Edificio: ${salon.NOMBRE}</p>
                        <p>Piso ${salon.PISO}</p>
                        <p>Capacidad: ${salon.CAPACIDAD}</p>
                    </span>
                </li>
            `;

            button.addEventListener('click', () => {
                alert(`Has seleccionado el salón ${salon.ID_SALON}`);

                // Guardar el objeto del salón en localStorage
                localStorage.setItem('selectedSalon', JSON.stringify(salon));

                // Redirigir a la página de reservas
                location.href = `reservacion-user.html`;
                localStorage.setItem('selectedMenu', 'reservacion-user');

            });


            salonesContainer.appendChild(button);
        });


    } catch (err) {
        console.error('Error al obtener los edificios:', err);
    }
});
///-----------------------------------------------------------------------------


// --------------------- SALONES -------------------------------------------
// Filtrar salones cuando se selecciona un edificio
document.getElementById('building-filter').addEventListener('change', async (event) => {
    var selectedEdificio = event.target.value;

    try {
        const response = await fetch(`/api/salones?edificio=${selectedEdificio}`);
        const salones = await response.json();  // Convertimos la respuesta a JSON

        // Limpiar el contenedor de salones
        const salonesContainer = document.getElementById('salonesContainer');
        salonesContainer.innerHTML = '';

        // Agregar los salones al contenedor
        salones.forEach(salon => {
            const button = document.createElement('button');
            button.classList.add('invisibleButton');
            button.innerHTML = `
                <li>
                    <i class='bx bx-code-block' style='color:#4daadb'></i>
                    <span class="text">
                        <h3>${salon.ID_SALON}</h3>
                        <p>Edificio: ${salon.NOMBRE}</p>
                        <p>Piso ${salon.PISO}</p>
                        <p>Capacidad: ${salon.CAPACIDAD}</p>
                    </span>
                </li>
            `;

            button.addEventListener('click', () => {
                alert(`Has seleccionado el salón ${salon.ID_SALON}`);

                // Guardar el objeto del salón en localStorage
                localStorage.setItem('selectedSalon', JSON.stringify(salon));



                // Redirigir a la página de reservas
                location.href = `reservacion-user.html`;
                localStorage.setItem('selectedMenu', 'reservacion-user');
            });

            // Usar el contenedor correcto
            salonesContainer.appendChild(button);

        });
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
});


// ---------------------------------------------------------------------------------


// Función para cambiar la pestaña activa a 'Reservar'
function changeSidebarTab() {
    // Eliminar la clase 'active' de cualquier elemento con esa clase
    const sideMenuItems = document.querySelectorAll('#sidebar .side-menu.top li a');
    sideMenuItems.forEach(item => item.classList.remove('active'));

    // Agregar la clase 'active' a la pestaña 'Reservar'
    const reservacionesTab = document.querySelector('a[data-home="reservacion-user"]').parentElement;
    reservacionesTab.classList.add('active');
}

//---------------------------------- var-search -----------------------------------

document.addEventListener("keyup", e => {
    if (e.target.matches("#search")) {
        document.querySelectorAll('.invisibleButton').forEach(button => {
            button.textContent.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase())
                ?
                button.classList.remove("filter") : button.classList.add("filter")
        });
    }
});

//------------------------------------------------------------------------------------