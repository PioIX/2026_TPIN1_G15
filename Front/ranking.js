const usuarioLogueado = localStorage.getItem("usuario");

async function obtenerRanking() {

    const respuesta = await fetch("http://localhost:4000/rankings");

    return await respuesta.json();

}

function medallaSegunPuesto(puesto) {

    if (puesto === 1) return "🥇";
    if (puesto === 2) return "🥈";
    if (puesto === 3) return "🥉";
    return puesto;

}

async function mostrarRanking() {

    const cuerpo = document.getElementById("cuerpoRanking");

    try {

        const usuarios = await obtenerRanking();

        if (!usuarios || usuarios.length === 0) {

            cuerpo.innerHTML = `
                <tr>
                    <td colspan="3">Todavía no hay usuarios con puntos.</td>
                </tr>
            `;

            return;

        }

        let filas = "";

        usuarios.slice(0, 10).forEach((usuario, indice) => {

            const puesto = indice + 1;

            const clase =
                usuario.usuario == usuarioLogueado
                    ? "usuario-actual"
                    : "";

            filas += `
                <tr class="${clase}">
                    <td>${medallaSegunPuesto(puesto)}</td>
                    <td>${usuario.nombre_completo}</td>
                    <td>${usuario.puntos}</td>
                </tr>
            `;

        });

        cuerpo.innerHTML = filas;

        // Buscar la posición del usuario logueado
        const posicion = usuarios.findIndex(
            u => u.usuario == usuarioLogueado
        ) + 1;

        if (posicion > 0) {
            document.getElementById("miPosicion").innerHTML = `
                <div class="dato">👤 <strong>${usuarios[posicion - 1].nombre_completo}</strong></div>
                <div class="dato">🏆 Puesto <strong>#${posicion}</strong></div>
                <div class="dato">⭐ <strong>${usuarios[posicion - 1].puntos}</strong> puntos</div>
            `;

        }

    } catch (error) {

        console.error(error);

        cuerpo.innerHTML = `
            <tr>
                <td colspan="3">No se pudo cargar el ranking.</td>
            </tr>
        `;

    }

}

mostrarRanking();