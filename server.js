const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
//const bodyParser = require('body-parser');
const app = express();

app.use(cors());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

//app.use(bodyParser.json()); // Para leer datos en formato JSON
//app.use(bodyParser.urlencoded({ extended: true })); // Para leer datos de formularios
app.use(express.json()); // Para leer datos JSON
app.use(express.urlencoded({ extended: true })); // Para leer datos de formularios codificados en URL
// Configuración de conexión a la base de datos
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'ORCL',
  database: 'proyecto_is'
});

// Probar la conexión
connection.connect(err => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Ruta para manejar el login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = `
    SELECT * FROM RESPONSABLES 
    WHERE ID_RESPONSABLE = ? AND PASSWORD = ?;
  `;

  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }

    console.log(results)
    if (results.length > 0) {
      const { PASSWORD, ...userWithoutPassword } = results[0]; // Excluir la contraseña
      res.json({ success: true, user: userWithoutPassword }); // Enviar el

    } else {
      res.json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});

// 1. API para la tabla RESPONSABLES
app.get('/api/responsables', (req, res) => {
  const query = 'SELECT * FROM RESPONSABLES';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(results);
    }
  });
});

// 2. API para la tabla EDIFICIOS
app.get('/api/edificios', (req, res) => {
  const query = 'SELECT * FROM EDIFICIOS';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(results);
    }
  });
});


// 3 API para la tabla SALONES (con filtro por edificio)
app.get('/api/salones', (req, res) => {
  var { edificio } = req.query;

  // Si 'edificio' existe, filtramos por él. Si no, devolvemos todos los salones.
  const query = edificio ?
    `SELECT s.*, e.NOMBRE as NOMBRE_EDIFICIO FROM SALONES s JOIN EDIFICIOS e ON s.ID_EDIFICIO = e.ID_EDIFICIO WHERE s.ID_EDIFICIO = ?` :
    `SELECT s.*, e.NOMBRE as NOMBRE_EDIFICIO FROM SALONES s JOIN EDIFICIOS e ON s.ID_EDIFICIO = e.ID_EDIFICIO`;

  connection.query(query, [edificio], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(results);
    }
  });
});

// 4. API para la tabla EQUIPOS
app.get('/api/equipos', (req, res) => {
  const query = 'SELECT * FROM EQUIPOS';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(results);
    }
  });
});

// 5. API para la tabla SALON_EQUIPOS
app.get('/api/salon_equipos', (req, res) => {
  const query = 'SELECT * FROM SALON_EQUIPOS';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(results);
    }
  });
});

// 6. API para la tabla RESERVACIONES
app.get('/api/reservaciones', (req, res) => {
  const query = 'SELECT * FROM RESERVACIONES';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(results);
    }
  });
});


// API para obtener los equipos del salón
app.get('/obtenerEquiposSalon/:id_salon', (req, res) => {
  const idSalon = req.params.id_salon; // Obtener el ID_SALON del parámetro de la URL

  const query = `
      SELECT TIPO, COUNT(TIPO) AS cantidad
      FROM EQUIPOS 
      JOIN SALON_EQUIPOS USING(ID_EQUIPO)
      WHERE ID_SALON = ?
      GROUP BY TIPO;
  `;

  // Ejecutar la consulta pasando el ID_SALON como parámetro
  connection.query(query, [idSalon], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error en la consulta');
    }

    // Enviar los resultados al frontend en formato JSON
    res.json(results);
  });
});

// ----------------------- Insert a reservacoines ----------------------------------------


app.post('/reservar', (req, res) => {
  const { id_salon, id_responsable, fecha, horario_entrada, horario_salida, asunto } = req.body;

  // Convertir las fechas a formato adecuado
  const formattedFecha = formatDate(fecha); // Asegúrate de que la fecha esté en formato YYYY-MM-DD
  const formattedHorarioEntrada = formatTime(horario_entrada); // Asegúrate de que la hora esté en formato HH:MM:SS
  const formattedHorarioSalida = formatTime(horario_salida); // Asegúrate de que la hora esté en formato HH:MM:SS

  // Consulta para verificar si hay superposición de fechas
  const queryCheckOverlap = `
    SELECT * FROM RESERVACIONES
WHERE SALON = ?
AND STATUS = 'Pendiente'
AND (
  (FECHA = ?)
  AND (
    (HORARIO_ENTRADA < ? AND HORARIO_SALIDA > ?)
  )
);

  `;

  connection.query(queryCheckOverlap, [id_salon, formattedFecha, formattedHorarioSalida, formattedHorarioEntrada,], (err, results) => {
    if (err) {
      console.error('Error al verificar la superposición:', err);
      return res.status(500).json({ message: 'Error en la verificación de superposición' });
    }
 
    console.log("numero de datos: "+results.length)

    if (results.length > 0) {
      return res.status(400).json({ message: 'Ya existe una reservación pendiente en este horario.' });
    }
    console.log("entro al query de reservar")
    // Si no hay superposición, proceder a insertar la nueva reservación
    const queryInsert = `
      INSERT INTO RESERVACIONES (SALON, ID_RESPONSABLE, FECHA, HORARIO_ENTRADA, HORARIO_SALIDA, ASUNTO, STATUS)
      VALUES (?, ?, ?, ?, ?, ?, 'Pendiente');
    `;

    connection.query(queryInsert, [id_salon, id_responsable, formattedFecha, formattedHorarioEntrada, formattedHorarioSalida, asunto], (err, results) => {
      
      console.log("Reservacoin: ")
      console.log(results)
      if (err) {
        console.error('Error al insertar la reservación:', err);
        return res.status(500).json({ message: 'Error al insertar la reservación en la base de datos', error: err.message });
      }

      res.status(200).send('Reservación realizada con éxito');
    });
  });
});

// Función para formatear la fecha
function formatDate(dateString) {
  const [day, month, year] = dateString.split('-');
  return `${year}-${month}-${day}`;
}

// Función para formatear la hora (asegúrate de que la hora esté en formato HH:MM:SS)
function formatTime(timeString) {
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');

  if (modifier === 'PM' && hours !== '12') {
    hours = parseInt(hours, 10) + 12; // Convierte la hora PM a formato 24 horas
  } else if (modifier === 'AM' && hours === '12') {
    hours = '00'; // Maneja el caso de las 12 AM
  }

  return `${hours}:${minutes}:00`; // Asegúrate de agregar los segundos
}

//----------------- tabla de reservas ------------------------
/*
app.get('/api/reservas', (req, res) => {
  const { id_responsable } = req.query;

  if (!id_responsable) {
    return res.status(400).send('El parámetro id_responsable es requerido');
  }

  const query = `
    SELECT ID_RESERVACION, SALON, NOMBRE AS EDIFICIO, FECHA, HORARIO_ENTRADA, 
           HORARIO_SALIDA, ASUNTO, STATUS 
    FROM RESERVACIONES re 
    JOIN SALONES sa ON sa.ID_SALON = re.SALON 
    JOIN EDIFICIOS USING(ID_EDIFICIO) 
    WHERE ID_RESPONSABLE = ?
    ORDER BY ID_RESERVACION ASC`;

  connection.query(query, [id_responsable], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error en la base de datos');
    } else {
      res.json(results);
    }
  });
});
*/
app.get('/api/reservas', (req, res) => {
  const { id_responsable, status, salon, edificio } = req.query;

  // Validar que id_responsable esté presente
  if (!id_responsable) {
    return res.status(400).json({ error: 'El parámetro id_responsable es requerido' });
  }

  // Construir la consulta SQL base
  let query = `
    SELECT 
      ID_RESERVACION,
      re.SALON,
      ed.NOMBRE AS EDIFICIO,
      FECHA,
      HORARIO_ENTRADA,
      HORARIO_SALIDA,
      ASUNTO,
      STATUS
    FROM RESERVACIONES re 
    JOIN SALONES sa ON sa.ID_SALON = re.SALON 
    JOIN EDIFICIOS ed ON ed.ID_EDIFICIO = sa.ID_EDIFICIO
    WHERE ID_RESPONSABLE = ?`;

  // Agregar los filtros si están presentes
  const params = [id_responsable];
  
  if (status) {
    query += ' AND STATUS = ?';
    params.push(status);
  }

  if (salon) {
    query += ' AND re.SALON = ?';
    params.push(salon);
  }

  if (edificio) {
    query += ' AND ed.NOMBRE = ?';
    params.push(edificio);
  }

  // Ordenar los resultados por fecha y hora
  query += ' ORDER BY FECHA DESC, HORARIO_ENTRADA ASC';

  console.log('Query:', query);
  console.log('Params:', params);

  // Ejecutar la consulta
  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).json({ error: 'Error en la base de datos' });
    }
    console.log('Resultados:', results);
    res.json(results);
  });
});


// ====================  Update de reservas ==================================
app.put('/api/reservas/:id/completar', (req, res) => {
  const { id } = req.params; // ID de la reserva

  // Consulta SQL para actualizar el status
  const query = 'UPDATE RESERVACIONES SET STATUS = ? WHERE ID_RESERVACION = ?';
  const params = ['completada', id];

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error en la base de datos');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Reserva no encontrada');
    } else {
      res.json({ message: 'Reserva completada exitosamente' });
    }
  });
});

// ==================== Borrado de reservas ==================================

app.delete('/api/reservas/:id', (req, res) => {
  const { id } = req.params; // ID de la reserva

  // Consulta SQL para eliminar la reserva
  const query = 'DELETE FROM RESERVACIONES WHERE ID_RESERVACION = ?';
  const params = [id];

  connection.query(query, params, (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).send('Error en la base de datos');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Reserva no encontrada');
    } else {
      res.json({ message: 'Reserva eliminada exitosamente' });
    }
  });
});

// Endpoint para verificar la contraseña
app.post('/verificar-password', (req, res) => {
  const { id_responsable, password } = req.body;

  const query = `
    SELECT * FROM RESPONSABLES 
    WHERE ID_RESPONSABLE = ? AND PASSWORD = ?;
  `;

  connection.query(query, [id_responsable, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }

    res.json({ success: results.length > 0 });
  });
});

// Configurar el puerto del servidor
const port = 5000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
