var express = require('express'); //Tipo de servidor: Express
var bodyParser = require('body-parser'); //Convierte los JSON
var cors = require('cors');
const { realizarQuery } = require('./modulos/mysql');

var app = express(); //Inicializo express
var port = process.env.PORT || 4000; //Ejecuto el servidor en el puerto 4000

// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Pongo el servidor a escuchar
app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}`);
});

app.get('/', function (req, res) {
    res.status(200).send({
        message: 'GET Home route working fine!'
    });
});
//===========================
// REGISTRO
//===========================

app.post("/registro", async (req, res) => {

    const { nombre_completo, usuario, email, contrasena } = req.body;

    const existe = await realizarQuery(`
        SELECT *
        FROM Usuarios
        WHERE usuario='${usuario}'
        OR email='${email}'
    `);

    if (existe.length > 0) {
        return res.send({
            success: false,
            mensaje: "El usuario ya existe"
        });
    }

    await realizarQuery(`
        INSERT INTO Usuarios
        (nombre_completo,usuario,email,contrasena)

        VALUES(
        '${nombre_completo}',
        '${usuario}',
        '${email}',
        '${contrasena}'
        )
    `);

    res.send({
        success: true,
        mensaje: "Usuario registrado"
    });

});


//===========================
// LOGIN
//===========================

app.post("/login", async (req, res) => {

    const usuario = await realizarQuery(`
        SELECT *
        FROM Usuarios
        WHERE usuario='${req.body.usuario}'
        AND contrasena='${req.body.contrasena}'
    `);
    if (usuario.length == 0) {

        return res.send({
            login: false,
            mensaje: "Usuario o contraseña incorrectos"
        });

    }
    res.send({

        login: true,
        id_usuario: usuario[0].id_usuario,
        admin: usuario[0].es_admin,
        usuario: usuario[0].usuario

    });

});

//OBTENER CLUBES
app.get("/clubes", async (req, res) => {

    const respuesta = await realizarQuery(`
        SELECT * FROM Clubes
        ORDER BY nombre
    `);

    res.send(respuesta);

});

//OBTENER JUGADORES
app.get("/jugadores", async (req, res) => {

    const respuesta = await realizarQuery(`
        SELECT
            f.*,
            c.nombre AS club,
            l.nombre AS liga

        FROM Futbolistas f

        INNER JOIN Clubes c
            ON f.id_club = c.id_club

        INNER JOIN Ligas l
            ON c.id_liga = l.id_liga

        ORDER BY f.apellido,f.nombre
    `);

    res.send(respuesta);

});

// Obtener usuarios
app.get("/usuarios", async (req, res) => {

    const respuesta = await realizarQuery(`
        SELECT *
        FROM Usuarios
        ORDER BY nombre_completo
    `);

    res.send(respuesta);

});

app.post("/jugadores", async (req, res) => {

    const existe = await realizarQuery(`
        SELECT *
        FROM Futbolistas
        WHERE nombre='${req.body.nombre}'
        AND apellido='${req.body.apellido}'
        AND id_club=${req.body.id_club}
    `);

    if (existe.length > 0) {
        return res.send({
            success: false,
            mensaje: "El futbolista ya existe"
        });
    }

    await realizarQuery(`
        INSERT INTO Futbolistas
        (nombre, apellido, nacionalidad, posicion, dorsal, edad, id_club)
        VALUES
        (
            '${req.body.nombre}',
            '${req.body.apellido}',
            '${req.body.nacionalidad}',
            '${req.body.posicion}',
            ${req.body.dorsal},
            ${req.body.edad},
            ${req.body.id_club}
        )
    `);

    res.send({
        success: true,
        mensaje: "Futbolista agregado"
    });

});

app.put("/jugadores/:id", async (req, res) => {

    const existe = await realizarQuery(`
        SELECT *
        FROM Futbolistas
        WHERE id_futbolista=${req.params.id}
    `);

    if (existe.length == 0) {
        return res.send({
            success: false,
            mensaje: "El futbolista no existe"
        });
    }

    await realizarQuery(`
        UPDATE Futbolistas
        SET dorsal=${req.body.dorsal}
        WHERE id_futbolista=${req.params.id}
    `);

    res.send({
        success: true,
        mensaje: "Futbolista actualizado"
    });

});

app.delete("/jugadores/:id", async (req, res) => {

    const existe = await realizarQuery(`
        SELECT *
        FROM Futbolistas
        WHERE id_futbolista=${req.params.id}
    `);

    if (existe.length == 0) {
        return res.send({
            success: false,
            mensaje: "El futbolista no existe"
        });
    }

    await realizarQuery(`
        DELETE FROM Futbolistas
        WHERE id_futbolista=${req.params.id}
    `);

    res.send({
        success: true,
        mensaje: "Futbolista eliminado"
    });

});

app.put("/usuarios/:id", async (req, res) => {

    const existe = await realizarQuery(`
        SELECT *
        FROM Usuarios
        WHERE id_usuario=${req.params.id}
    `);

    if (existe.length == 0) {
        return res.send({
            success: false,
            mensaje: "El usuario no existe"
        });
    }

    await realizarQuery(`
        UPDATE Usuarios
        SET es_admin=${req.body.es_admin}
        WHERE id_usuario=${req.params.id}
    `);

    res.send({
        success: true,
        mensaje: "Usuario actualizado"
    });

});

app.delete("/usuarios/:id", async (req, res) => {

    const existe = await realizarQuery(`
        SELECT *
        FROM Usuarios
        WHERE id_usuario=${req.params.id}
    `);

    if (existe.length == 0) {
        return res.send("El usuario no existe");
    }

    await realizarQuery(`
        DELETE FROM Usuarios
        WHERE id_usuario=${req.params.id}
    `);

    res.send("Usuario eliminado");

});

app.post("/partida", async (req, res) => {

    const usados = req.body.usados || [];

    let consulta = `
        SELECT id_futbolista
        FROM Futbolistas
    `;

    if (usados.length > 0) {

        consulta += `
            WHERE id_futbolista NOT IN (${usados.join(",")})
        `;

    }

    const jugadores = await realizarQuery(consulta);

    if (jugadores.length == 0) {

        return res.send({
            terminado: true
        });

    }

    const aleatorio =
        jugadores[Math.floor(Math.random() * jugadores.length)];

    await realizarQuery(`
        INSERT INTO Partidas
        (id_usuario,id_futbolista_objetivo)

        VALUES
        (${req.body.id_usuario},${aleatorio.id_futbolista})
    `);

    const partida = await realizarQuery(`
        SELECT MAX(id_partida) AS id_partida
        FROM Partidas
    `);

    res.send({

        id_partida: partida[0].id_partida

    });

});

app.post("/intento", async (req, res) => {

    const { id_partida, id_futbolista } = req.body;

    const partida = await realizarQuery(`
        SELECT *
        FROM Partidas
        WHERE id_partida=${id_partida}
    `);

    const objetivo = await realizarQuery(`
        SELECT
            f.*,
            c.nombre AS club,
            c.id_liga,
            l.nombre AS liga
        FROM Futbolistas f
        INNER JOIN Clubes c
            ON f.id_club = c.id_club
        INNER JOIN Ligas l
            ON c.id_liga = l.id_liga
        WHERE f.id_futbolista=${partida[0].id_futbolista_objetivo}
    `);

    const elegido = await realizarQuery(`
        SELECT
            f.*,
            c.nombre AS club,
            c.id_liga,
            l.nombre AS liga
        FROM Futbolistas f
        INNER JOIN Clubes c
            ON f.id_club = c.id_club
        INNER JOIN Ligas l
            ON c.id_liga = l.id_liga
        WHERE f.id_futbolista=${id_futbolista}
    `);

    const cantidad = await realizarQuery(`
        SELECT COUNT(*) cantidad
        FROM Intentos
        WHERE id_partida=${id_partida}
    `);

    await realizarQuery(`
        INSERT INTO Intentos
        (numero_intento,id_partida,id_futbolista)
        VALUES
        (
            ${cantidad[0].cantidad + 1},
            ${id_partida},
            ${id_futbolista}
        )
    `);
    const numeroIntento = cantidad[0].cantidad + 1;
    const j = elegido[0];
    const o = objetivo[0];
    const gano = j.id_futbolista == o.id_futbolista;

    let puntos = 0;
    if (gano) {

        puntos = 10;

        switch (numeroIntento) {

            case 1:
                puntos = 100;
                break;

            case 2:
                puntos = 90;
                break;

            case 3:
                puntos = 80;
                break;

            case 4:
                puntos = 70;
                break;

            case 5:
                puntos = 60;
                break;

            case 6:
                puntos = 50;
                break;

            case 7:
                puntos = 40;
                break;

            case 8:
                puntos = 30;
                break;

            case 9:
                puntos = 20;
                break;

        }

        await realizarQuery(`

        UPDATE Usuarios

        SET puntos = puntos + ${puntos}

        WHERE id_usuario = ${partida[0].id_usuario}

    `);

    }
    res.send({

        ganado: gano,
        
        puntos_obtenidos: puntos,

        nacionalidad: j.nacionalidad == o.nacionalidad,

        club: j.id_club == o.id_club,

        liga: j.id_liga == o.id_liga,

        posicion: j.posicion == o.posicion,

        id_objetivo: o.id_futbolista,

        dorsal: {

            correcto: j.dorsal == o.dorsal,

            mayor: j.dorsal < o.dorsal

        },

        edad: {

            correcto: j.edad == o.edad,

            mayor: j.edad < o.edad

        }
        
    });

});

//OBTENER RANKING DE USUARIOS (de mayor a menor puntaje)
app.get("/rankings", async (req, res) => {

    const respuesta = await realizarQuery(`
        SELECT usuario, nombre_completo, puntos
        FROM Usuarios
        ORDER BY puntos DESC, usuario ASC
    `);

    res.send(respuesta);

});
