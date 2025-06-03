const url = 'http://localhost:3000/valoraciones';

// Cargar valoraciones cuando se abre la página
window.onload = function () {
    cargarValoraciones();
};

// Cargar todas las valoraciones
function cargarValoraciones() {
    fetch(url)
        .then(response => response.json())
        .then(valoraciones => {
            mostrarValoraciones(valoraciones);
        })
        .catch(error => {
            console.log('Error:', error);
        });
}

// Función para mostrar las valoraciones en pantalla
function mostrarValoraciones(valoraciones) {
    const lista = document.getElementById('listaValoraciones');
    lista.innerHTML = ''; // Limpiar la lista

    valoraciones.forEach(valoracion => {
        const div = document.createElement('div');
        div.className = 'valoracion';

        const estrellas = '⭐'.repeat(valoracion.puntuacion);

        div.innerHTML = `
                    <h3>${valoracion.usuario}</h3>
                    <div class="comentario">${valoracion.comentario}</div>
                    <div class="puntuacion">${estrellas}</div>
                    <div class="acciones">
                        <button class="borrar" onclick="borrarValoracion(${valoracion.id})">Borrar</button>
                    </div>
                `;

        lista.appendChild(div);
    });
}

// Envío del formulario
document.getElementById('formValoracion').onsubmit = function (e) {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const comentario = document.getElementById('comentario').value;
    const puntuacion = document.getElementById('puntuacion').value;
    const id = document.getElementById('valoracionId').value;

    const datos = {
        id : id,
        usuario: usuario,
        comentario: comentario,
        puntuacion: parseInt(puntuacion)
    };
    crearValoracion(datos);
};

// Función para crear nueva valoración
function crearValoracion(datos) {
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
    })
        .then(response => response.json())
        .then(resultado => {
            console.log('Valoración creada:', resultado);
            limpiarFormulario();
            cargarValoraciones();
        })
        .catch(error => {
            console.log('Error:', error);
        });
}


// Función para borrar valoración
function borrarValoracion(id) {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json', // Opcional, si el cuerpo necesita un tipo de contenido
        },
    };

    fetch(url + '/' + id, options)
        .then(response => {
            if (!response.ok) {
                throw new Error('La solicitud DELETE no fue exitosa');
            }
            return response.json(); // Opcional, si la respuesta es JSON
        })
        .then(data => {
            console.log('Recurso eliminado correctamente:', data);
        })
        .catch(error => {
            console.error('Error durante la solicitud DELETE:', error);
        });
}


// Limpiar el formulario
function limpiarFormulario() {
    document.getElementById('formValoracion').reset();
    document.getElementById('valoracionId').value = '';
}