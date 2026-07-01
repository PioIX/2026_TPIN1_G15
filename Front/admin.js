async function obtenerJugadores(){

    const respuesta = await fetch("http://localhost:4000/jugadores");

    return await respuesta.json();

}

async function obtenerClubes(){

    const respuesta = await fetch("http://localhost:4000/clubes");

    return await respuesta.json();

}
async function agregarJugador() {
    const clubes = await obtenerClubes();
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

async function guardarJugador(){

    const respuesta = await fetch("http://localhost:4000/jugadores",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            nombre:document.getElementById("nombreJugador").value,
            apellido:document.getElementById("apellidoJugador").value,
            nacionalidad:document.getElementById("nacionalidadJugador").value,
            edad:document.getElementById("edadJugador").value,
            posicion:document.getElementById("posicionJugador").value,
            dorsal:document.getElementById("dorsalJugador").value,
            id_club:document.getElementById("clubJugador").value

        })

    });

    const datos=await respuesta.json();

    alert(datos.mensaje);

    cerrarModal();

}

async function editarJugador() {
    const jugadores = await obtenerJugadores();

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
        <input type="number" id="nuevoDorsal"><br><br>

        <button onclick=actualizarJugador()>Actualizar</button>
        `
    );
}

async function actualizarJugador(){

    const id=document.getElementById("jugadorEditar").value;

    const dorsal=document.getElementById("nuevoDorsal").value;

    const respuesta=await fetch("http://localhost:4000/jugadores/"+id,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            dorsal:dorsal

        })

    });

    const datos=await respuesta.json();

    alert(datos.mensaje);

    cerrarModal();

}

async function eliminarJugador(){

    const jugadores=await obtenerJugadores();

    let opciones="";

    jugadores.forEach(jugador=>{

        opciones+=`
        <option value="${jugador.id_futbolista}">
            ${jugador.nombre} ${jugador.apellido}
        </option>
        `;

    });

    abrirModal(

        "Eliminar jugador",

        `
        Jugador
        <br>
        <select id="jugadorEliminar">

        ${opciones}

        </select>
        <br><br>
        <button onclick="borrarJugador()">Eliminar</button>`
    );

}

async function borrarJugador(){

    const id=document.getElementById("jugadorEliminar").value;

    const respuesta=await fetch("http://localhost:4000/jugadores/"+id,{

        method:"DELETE"

    });

    const datos=await respuesta.json();

    alert(datos.mensaje);

    cerrarModal();

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

async function actualizarUsuario(){

    const id=document.getElementById("idUsuario").value;
    const es_admin=document.getElementById("esAdmin").value;
    const respuesta=await fetch("http://localhost:4000/usuarios/"+id,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            es_admin:es_admin
        })

    });

    const datos=await respuesta.json();

    alert(datos.mensaje);

    cerrarModal();

}

function eliminarUsuario(){

    abrirModal(

        "Eliminar usuario",

        `ID del usuario

        <br>

        <input type="number" id="idEliminarUsuario">

        <br><br>
        <button onclick="borrarUsuario()">Eliminar</button>`
    );

}

async function borrarUsuario(){

    const id=document.getElementById("idEliminarUsuario").value;

    const respuesta=await fetch("http://localhost:4000/usuarios/"+id,{

        method:"DELETE"

    });

    const datos=await respuesta.json();

    alert(datos.mensaje);

    cerrarModal();

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