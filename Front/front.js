async function registrarse() {

    const datos = {
        nombre_completo: document.getElementById("nombre").value,
        usuario: document.getElementById("usuarioRegistro").value,
        email: document.getElementById("email").value,
        contrasena: document.getElementById("passwordRegistro").value
    };

    const respuesta = await fetch("http://localhost:4000/registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    const data = await respuesta.json();

    alert(data.mensaje);
}

async function login() {

    const respuesta = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: document.getElementById("usuarioLogin").value,
            contrasena: document.getElementById("passwordLogin").value
        })
    });

    const datos = await respuesta.json();
    console.log(datos);

    if (datos.login) {

        if (datos.admin) {
            window.location.href = "admin.html";
        }
        else {
            window.location.href = "juego.html";
        }

    } else {
        alert(datos.mensaje);
    }
}

function cerrarSesion() {
    window.location.href = "login.html";
}