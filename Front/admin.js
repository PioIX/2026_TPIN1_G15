async function obtenerJugadores(){

    const respuesta = await fetch("http://localhost:4000/jugadores");

    return await respuesta.json();

}

async function obtenerClubes(){

    const respuesta = await fetch("http://localhost:4000/clubes");

    return await respuesta.json();

}
async function agregarJugador() {
    const respuesta = await fetch("http://localhost:4000/clubes");

    const clubes = await respuesta.json();
    let opcionesClubes = "";

    clubes.forEach(club => {

        opcionesClubes += `
        <option value="${club.id_club}">
            ${club.nombre}
        </option>
    `;

    });
    abrirModal(
        "Agregar jugador",

        `
        Nombre<br>
        <input type="text" id="nombreJugador"><br><br>

        Apellido<br>
        <input type="text" id="apellidoJugador"><br><br>

        Nacionalidad<br>
        <input type="text" id="nacionalidadJugador"><br><br>

        Edad<br>
        <input type="number" id="edadJugador"><br><br>

        Posición<br>
        <select id="posicionJugador">
            <option>Arquero</option>
            <option>Defensa</option>
            <option>Mediocampista</option>
            <option>Delantero</option>
        </select><br><br>

        Dorsal<br>
        <input type="number" min="1" max="99" id="dorsalJugador"><br><br>

        Club<br>
        <select id="clubJugador">
            ${opcionesClubes}
        </select>

        <button onclick="guardarJugador()">Agregar</button>
        `
    );
}

async function editarJugador() {
    const respuesta = await fetch("http://localhost:4000/jugadores");

    const jugadores = await respuesta.json();

    let opciones = "";

    jugadores.forEach(jugador => {

        opciones += `
        <option value="${jugador.id_futbolista}">
            ${jugador.nombre} ${jugador.apellido}
        </option>
    `;

    });
    abrirModal(
        "Editar jugador",

        `
        Jugador<br>

        <select id="jugadorEditar">
            ${opciones}
        </select><br><br>

        Nuevo dorsal<br>
        <input type="number"><br><br>

        <button>Actualizar</button>
        `
    );

}

function eliminarJugador() {

    abrirModal(
        "Eliminar jugador",

        `
        Jugador<br>

        <select id="jugadorEliminar">

            <option value="1">Erling Haaland</option>
            <option value="2">Phil Foden</option>
            <option value="3">Florian Wirtz</option>
            <option value="4">Virgil van Dijk</option>
            <option value="5">Mohamed Salah</option>

        </select><br><br>

        <button>Eliminar</button>
        `
    );

}


function editarUsuario() {
    abrirModal(
        "Editar usuario",

        `
        ID del usuario<br>
        <input type="number" id="idUsuario"><br><br>

        ¿Administrador?<br>
        <select id="esAdmin">
            <option value="0">No</option>
            <option value="1">Sí</option>
        </select><br><br>

        <button onclick="actualizarUsuario()">Actualizar</button>
        `
    );
}

function actualizarUsuario() {

    const id = document.getElementById("idUsuario").value;
    const es_admin = document.getElementById("esAdmin").value;

    console.log(id, es_admin);

}

function eliminarUsuario() {
    abrirModal(
        "Eliminar usuario",

        `
        ID del jugador<br>

        <input type="number"><br><br>

        <button>Eliminar</button>
        `
    );
}

function llevarAlJuego() {
    window.location.href = "juego.html";
}

function cerrarSesion() {
    window.location.href = "login.html";
}
function abrirModal(titulo, contenido) {

    document.getElementById("tituloModal").innerHTML = titulo;
    document.getElementById("contenidoModal").innerHTML = contenido;

    document.getElementById("modal").style.display = "block";
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}