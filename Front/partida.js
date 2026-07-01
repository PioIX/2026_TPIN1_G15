const inputJugador = document.getElementById('nombreJugador');
const selectJugadores = document.getElementById('listaJugadores');
let jugadores = [];

async function cargarJugadores() {
    const respuesta = await fetch('http://localhost:4000/jugadores');
    jugadores = await respuesta.json();
}

function filtrarJugadores(texto) {
    const textoNormalizado = texto.toLowerCase().trim();

    if (!textoNormalizado) {
        return [];
    }

    return jugadores.filter(jugador => {
        const nombre = jugador.nombre.toLowerCase();
        const apellido = jugador.apellido.toLowerCase();

        return nombre.startsWith(textoNormalizado) || apellido.startsWith(textoNormalizado);
    }).slice(0, 10);
}

async function inicializar() {
    await cargarJugadores();

    inputJugador.addEventListener('input', () => {
        const texto = inputJugador.value;
        const coincidencias = filtrarJugadores(texto);

        if (coincidencias.length === 0) {
            selectJugadores.style.display = 'none';
            selectJugadores.innerHTML = '';
            return;
        }

        selectJugadores.innerHTML = coincidencias.map(jugador => {
            return `<option value="${jugador.id_futbolista}">${jugador.nombre} ${jugador.apellido}</option>`;
        }).join('');

        selectJugadores.style.display = 'block';
    });

    selectJugadores.addEventListener('change', () => {
        const opcionSeleccionada = selectJugadores.options[selectJugadores.selectedIndex];
        if (opcionSeleccionada) {
            inputJugador.value = opcionSeleccionada.text;
            selectJugadores.style.display = 'none';
        }
    });
}

inicializar();