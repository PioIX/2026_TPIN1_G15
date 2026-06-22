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

app.post("/registro", async (req, res) => {

    const { nombre_completo, usuario, email, contrasena } = req.body;

    const existe = await realizarQuery(`
        SELECT * FROM Usuarios
        WHERE usuario = '${usuario}'
        OR email = '${email}'
    `);

    if (existe.length > 0) {
        return res.send({
            success: false,
            mensaje: "El usuario ya existe"
        });
    }

    await realizarQuery(`
        INSERT INTO Usuarios
        (nombre_completo, usuario, email, contrasena)
        VALUES
        ('${nombre_completo}', '${usuario}', '${email}', '${contrasena}')
    `);

    res.send({
        success: true,
        mensaje: "Usuario registrado"
    });

});

app.post("/login", async (req, res) => {

    const { usuario, contrasena } = req.body;

    const respuesta = await realizarQuery(`
        SELECT * FROM Usuarios
        WHERE usuario = '${usuario}'
        AND contrasena = '${contrasena}'
    `);

    if (respuesta.length == 0) {

        return res.send({
            success: false,
            mensaje: "Datos incorrectos"
        });

    }

    res.send({
        success: true,
        mensaje: "Login exitoso",
        usuario: respuesta[0]
    });

});

