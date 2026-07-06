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
        admin: usuario[0].es_admin,
        usuario: usuario[0].usuario

    });

});

//OBTENER CLUBES
app.get("/clubes", async (req,res)=>{

    const respuesta = await realizarQuery(`
        SELECT * FROM Clubes
        ORDER BY nombre
    `);

    res.send(respuesta);

});

//OBTENER JUGADORES
app.get("/jugadores", async (req,res)=>{

    const respuesta = await realizarQuery(`
        SELECT *
        FROM Futbolistas
        ORDER BY apellido,nombre
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

    if(existe.length==0){
        return res.send("El usuario no existe");
    }

    await realizarQuery(`
        DELETE FROM Usuarios
        WHERE id_usuario=${req.params.id}
    `);

    res.send("Usuario eliminado");

});