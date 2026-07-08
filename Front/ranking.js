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

        // El backend ya devuelve los usuarios ordenados de mayor a menor puntaje,
        // pero se ordena también acá por las dudas.
        usuarios.sort((a, b) => b.puntos - a.puntos);

        let filas = "";

        usuarios.forEach((usuario, indice) => {

            const puesto = indice + 1;

            filas += `
                <tr>
                    <td>${medallaSegunPuesto(puesto)}</td>
                    <td>${usuario.nombre_completo ?? usuario.usuario}</td>
                    <td>${usuario.puntos}</td>
                </tr>
            `;

        });

        cuerpo.innerHTML = filas;

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
