document.getElementById('login-form').addEventListener('submit', (event) => {
  event.preventDefault(); // Evitar que el formulario se recargue

  const id_responsable = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: id_responsable, password })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }
      return response.json();
    })
    .then(userData => {
      if (userData.success) {
        const user = userData.user; // Ahora es un objeto, no un arreglo
        localStorage.setItem('user',JSON.stringify(user));

        if (user.ROL === 'admin') {
          location.href = '/admin-dashboard.html';

        } else if (user.ROL === 'user') {
          location.href = '/salones-user.html';
          
        } else {
          alert('Rol desconocido');
        }
      } else {
        alert(userData.message); // Muestra el mensaje de error enviado desde el backend
      }
    })
    .catch(error => {
      console.error(error);
      alert('Error: ' + error.message);
    });
});
