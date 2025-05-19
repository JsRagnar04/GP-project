// -----------------------------------  Date-Form --------------------------------------
const today = new Date();
let sysdate = new Date(); // Formato YYYY-MM-DD

// Configuración del Date Picker
flatpickr("#date-picker", {
  dateFormat: "d-m-Y",
  minDate: sysdate, // Deshabilitar fechas anteriores al sysdate
  disable: [
    function (date) {
      // Deshabilitar sábados y domingos
      return date.getDay() === 0 || date.getDay() === 6 ; // 0 = Domingo, 6 = Sábado
    }
  ]
});

// Configuración del primer Time Picker (Hora de inicio)
const timePicker1 = flatpickr("#time-picker-1", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "h:i K",
  time_24hr: false,
  minTime: "07:00",
  maxTime: "19:00",
  minuteIncrement: 30,
  onChange: function (selectedDates, dateStr, instance) {
    const startTime = selectedDates[0];
    const endPicker = document.querySelector("#time-picker-2")._flatpickr;

    if (startTime) {
      // Calcular el mínimo para el segundo reloj
      const minEndTime = new Date(startTime);
      minEndTime.setMinutes(minEndTime.getMinutes() + 30);

      // Actualizar restricciones del segundo reloj
      endPicker.set("minTime", minEndTime.toTimeString().substring(0, 5));

      // Validar que la hora del reloj 2 cumpla las condiciones
      const endTime = endPicker.selectedDates[0];
      if (endTime && endTime <= startTime) {
        endPicker.setDate(minEndTime, false); // Ajustar automáticamente
      }
    }
  }
});

// Configuración del segundo Time Picker (Hora de fin)
const timePicker2 = flatpickr("#time-picker-2", {
  enableTime: true,
  noCalendar: true,
  dateFormat: "h:i K",
  time_24hr: false,
  minTime: "07:30",
  maxTime: "19:30",
  minuteIncrement: 30,
  onChange: function (selectedDates, dateStr, instance) {
    const endTime = selectedDates[0];
    const startPicker = document.querySelector("#time-picker-1")._flatpickr;

    if (endTime) {
      const startTime = startPicker.selectedDates[0];

      // Validar que la hora de fin sea al menos 30 minutos después de la hora de inicio
      if (startTime && endTime <= startTime) {
        const adjustedEndTime = new Date(startTime);
        adjustedEndTime.setMinutes(adjustedEndTime.getMinutes() + 30);
        instance.setDate(adjustedEndTime, false); // Ajustar automáticamente
      }
    }
  }
});

// Validar al cargar la página (para casos donde la página se recargue)
document.addEventListener("DOMContentLoaded", () => {
  const startPicker = document.querySelector("#time-picker-1")._flatpickr;
  const endPicker = document.querySelector("#time-picker-2")._flatpickr;

  const startTime = startPicker.selectedDates[0];
  const endTime = endPicker.selectedDates[0];

  if (startTime && endTime) {
    // Validar restricciones entre ambos pickers
    if (endTime <= startTime) {
      const adjustedEndTime = new Date(startTime);
      adjustedEndTime.setMinutes(adjustedEndTime.getMinutes() + 30);
      endPicker.setDate(adjustedEndTime, false); // Ajustar automáticamente
    }

    // Actualizar mínimo del segundo picker
    const minEndTime = new Date(startTime);
    minEndTime.setMinutes(minEndTime.getMinutes() + 30);
    endPicker.set("minTime", minEndTime.toTimeString().substring(0, 5));
  }
});

//------------------------ Salon -----------------------------------------------

// Obtener el objeto del salón desde localStorage
const selectedSalonJSON = localStorage.getItem('selectedSalon');

if (selectedSalonJSON) {
  // Convertir de JSON a un objeto
  const selectedSalon = JSON.parse(selectedSalonJSON);
  console.log('salon: ', selectedSalon.ID_SALON)
  document.addEventListener('DOMContentLoaded', async () => {

    try {


      // --------------------------------- Consulta equipos por salon

      fetch(`/obtenerEquiposSalon/${selectedSalon.ID_SALON}`)
        .then(response => response.json())
        .then(data => {
          txt = "";

          data.forEach(item => {

            let txtAux = `<p>${String(item.TIPO)}: ${String(item.cantidad)}</p>`;
            txt += txtAux;

          });

          //-------------- Muestra de salon
          const salonesContainer = document.getElementById('salonesContainer-res');
          salonesContainer.innerHTML = '';



          const button = document.createElement('button');
          button.classList.add('invisibleButton');
          button.style.marginLeft = '10%';
          button.innerHTML = `
        <li>
        <h1>SALON:</h1>
            <i class='bx bx-code-block' style='color:#4daadb'></i>
            <span class="text">
                <h3>${selectedSalon.ID_SALON}</h3>
                <p>Piso ${selectedSalon.PISO}</p>
                <p>Capacidad: ${selectedSalon.CAPACIDAD}</p>
            </span>
            <div>${txt}</div>
        </li>
    `;

          salonesContainer.appendChild(button);

        })
        .catch(error => console.error('Error al obtener los equipos:', error));




    } catch (error) {

    }

  });
} else {
  console.log('No hay un salón seleccionado en localStorage.');
}

//----------------------------- Botones ------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  const reservarBtn = document.getElementById('reservarBtn');

  // Función para validar los campos
  function validarCampos() {
    const fecha = document.getElementById('date-picker').value;
    const asunto = document.getElementById('asunto-inp').value;
    const horaInicio = document.getElementById('time-picker-1').value;
    const horaFin = document.getElementById('time-picker-2').value;

    // Comprobamos si algún campo está vacío
    if (!fecha || !asunto || !horaInicio || !horaFin) {
      alert("Por favor, completa todos los campos.");
      return false; // Prevenir la acción del botón si algún campo está vacío
    }

    // Si todos los campos están llenos, se puede proceder
    return true;
  }
  // Función para el botón "Reservar"
  reservarBtn.addEventListener('click', () => {

    if (!validarCampos()) {
      e.preventDefault(); // Evita que el formulario se envíe o se haga una acción no deseada
    } else {

      JSON.parse(selectedSalonJSON);

      const id_salon = JSON.parse(selectedSalonJSON).ID_SALON;
      const id_responsable = JSON.parse(localStorage.getItem('user')).ID_RESPONSABLE;
      // Obteniendo del localStorage
      const fecha = document.getElementById('date-picker').value;
      const horario_entrada = document.getElementById('time-picker-1').value;
      const horario_salida = document.getElementById('time-picker-2').value;
      const asunto = document.getElementById('asunto-inp').value;

      const reservationData = {
        id_salon,
        id_responsable,
        fecha,
        horario_entrada,
        horario_salida,
        asunto
      };

      console.log(reservationData)

      fetch('/reservar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(errData => {
              // Si la respuesta no es OK, lanzamos un error con el mensaje de la respuesta
              throw new Error(errData.message || 'Error al crear la reservación');
            });
          }
          return response.text();
        })
        .then(message => {
          alert(message);
          // Reset form after successful reservation
          document.getElementById('date-picker').value = '';
          document.getElementById('asunto-inp').value = '';
          document.getElementById('time-picker-1').value = '';
          document.getElementById('time-picker-2').value = '';
          
          // Clear the flatpickr instances
          document.querySelector("#date-picker")._flatpickr.clear();
          document.querySelector("#time-picker-1")._flatpickr.clear();
          document.querySelector("#time-picker-2")._flatpickr.clear();
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Hubo un problema al realizar la reservación: \n'+error.message);
        });
    }

  });

  // Función para el botón "Seleccionar salón"
  seleccionarBtn.addEventListener('click', () => {

    location.href = `salones-user.html`;
    localStorage.setItem('selectedMenu', 'salones-user');

  });
});

