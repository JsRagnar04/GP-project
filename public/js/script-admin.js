const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');
allSideMenu.forEach(item => {
	var li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i => {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');

		var menuId = li.querySelector('a').getAttribute('data-home');
		console.log(`Elemento seleccionado: ${menuId}`);


		if (menuId) {
			location.href = `${menuId}.html`;
			localStorage.setItem('selectedMenu', menuId);
			console.log('Redirigiendo a:', menuId + '.html');
		}
	})
});


document.addEventListener('DOMContentLoaded', function () {
	// Recupera el valor del menú seleccionado desde localStorage
	var selectedMenu = localStorage.getItem('selectedMenu');

	if (selectedMenu) {
		
		const activeItem = document.querySelector(`#sidebar .side-menu.top li a[data-home="${selectedMenu}"]`);
		allSideMenu.forEach(i => {
			i.parentElement.classList.remove('active');
		});
		if (activeItem) {
			activeItem.parentElement.classList.add('active');
		}
	}
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})


const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if (window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if (searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})

if (window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if (this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})


const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if (this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})


// Seleccionar todos los botones con la clase invisibleButton
const buttons = document.querySelectorAll('.invisibleButton');

// Iterar sobre cada botón y aplicar estilos y eventos
buttons.forEach((button) => {

	button.style.background = 'none'; // Sin fondo
	button.style.border = 'none';    // Sin borde
	button.style.color = 'blue';     // Cambiar color del texto
	button.style.padding = '0';      // Sin relleno
	button.style.cursor = 'pointer'; // Para que parezca un enlace

	// Agregar evento para conservar funcionalidad
	button.addEventListener('click', () => {
		alert('¡Botón invisible clickeado!');
	});
});