const inputJugador = document.getElementById("nombreJugador");
const selectJugadores = document.getElementById("listaJugadores");

let jugadores = [];
let idPartida = null;
let jugadorSeleccionado = null;

//========================================
// CARGAR JUGADORES
//========================================

async function cargarJugadores() {

    const respuesta = await fetch("http://localhost:4000/jugadores");

    jugadores = await respuesta.json();

}

//========================================
// CREAR PARTIDA
//========================================

async function crearPartida() {

    const respuesta = await fetch("http://localhost:4000/partida", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            id_usuario: 1      // Después lo reemplazaremos por el usuario logueado

        })

    });

    const datos = await respuesta.json();

    idPartida = datos.id_partida;

}

//========================================
// FILTRAR JUGADORES
//========================================

function filtrarJugadores(texto) {

    texto = texto.toLowerCase().trim();

    if (texto == "") return [];

    return jugadores.filter(jugador => {

        return jugador.nombre.toLowerCase().startsWith(texto) ||
               jugador.apellido.toLowerCase().startsWith(texto);

    }).slice(0,10);

}

//========================================
// COMPROBAR JUGADOR
//========================================

async function comprobarJugador() {

    const respuesta = await fetch("http://localhost:4000/intento", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            id_partida: idPartida,

            id_futbolista: jugadorSeleccionado.id_futbolista

        })

    });

    const datos = await respuesta.json();

    console.log(datos);

    actualizarPantalla(datos);

}

//========================================
// ACTUALIZAR PANTALLA
//========================================

function actualizarPantalla(datos){

    const historial=document.getElementById("historialIntentos");

    historial.innerHTML+=`

    <div class="circulos-row">

        <div class="circulos">
            <div class="circulo"
            style="background:${datos.nacionalidad?"green":"red"}">
                ${jugadorSeleccionado.nacionalidad}
            </div>
            <p>NAC</p>
        </div>

        <div class="circulos">
            <div class="circulo"
            style="background:${datos.club?"green":"red"}">
                ${jugadorSeleccionado.club}
            </div>
            <p>CLUB</p>
        </div>

        <div class="circulos">
            <div class="circulo"
            style="background:${datos.liga?"green":"red"}">
                ${jugadorSeleccionado.liga}
            </div>
            <p>LIGA</p>
        </div>

        <div class="circulos">
            <div class="circulo"
            style="background:${datos.posicion?"green":"red"}">
                ${jugadorSeleccionado.posicion}
            </div>
            <p>POS</p>
        </div>

        <div class="circulos">
            <div class="circulo"
            style="background:${datos.dorsal.correcto?"green":"red"}">
                ${jugadorSeleccionado.dorsal}
            </div>
            <p>NUM</p>
        </div>

        <div class="circulos">
            <div class="circulo"
            style="background:${datos.edad.correcto?"green":"red"}">
                ${jugadorSeleccionado.edad}
            </div>
            <p>EDAD</p>
        </div>

    </div>

    `;

    if(datos.ganado){
        alert("¡Ganaste!");
    }

}
//========================================
// INICIALIZAR
//========================================

async function inicializar() {

    await crearPartida();

    await cargarJugadores();

    inputJugador.addEventListener("input", () => {

        const coincidencias = filtrarJugadores(inputJugador.value);

        if (coincidencias.length == 0) {

            selectJugadores.innerHTML = "";

            selectJugadores.style.display = "none";

            return;

        }

        selectJugadores.innerHTML = coincidencias.map(jugador =>

            `<option value="${jugador.id_futbolista}">
                ${jugador.nombre} ${jugador.apellido}
            </option>`

        ).join("");

        selectJugadores.style.display = "block";

    });

    selectJugadores.addEventListener("change", async () => {

        const id = selectJugadores.value;

        jugadorSeleccionado = jugadores.find(j => j.id_futbolista == id);

        inputJugador.value =
            jugadorSeleccionado.nombre + " " + jugadorSeleccionado.apellido;

        selectJugadores.style.display = "none";
        selectJugadores.innerHTML = "";

        await comprobarJugador();

        inputJugador.value = "";

    });

}

inicializar();