import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

let secretKey = 'hakuna';

app.get('/login', (req, res) => {
    res.send(`<html>
        <head>
            <title>Login</title>
        </head>
        <body>
            <form method = "POST" action = "/auth">
            Nombre de usuario: <input type = "text" name = "username"><br>
            Contraseña: <input type = "password" name = "password"><br>
            <input type = "submit" value = "Iniciar sesión">
            </form>
        </body>
    </html>`)
});

app.post('/auth', (req, res) => {
    const {username, password} = req.body;

    //Si existe una BD, se debe consultar y validar tanto el username como password.

    const user = {username: username};
    const accessoToken = generarTokenAcceso(user);
    res.header('authorization', accessoToken).json({
        message: 'Usuario autenticado',
        token: accessoToken
    })

});

app.get('/api', validarToken, (req, res) => {
   res.json({
    username: req.user,
    tuits: [
        {
            id: 1,
            text: 'Los gatos son maravillosos.',
            username: 'gatolandia'
        },

        {
            id: 2,
            text: 'Los gatos son inmundos.',
            username: 'IhateCats'
        }
    ]
   });
});

function generarTokenAcceso(user){
    return jwt.sign(user, secretKey, {expiresIn: '5m'});
};

function validarToken(req, res, next){
    const accesoToken = req.headers['authorization'] || req.query.accesotoken;
    if(!accesoToken){
        res.send('Acceso denegado.');
    }else{
        jwt.verify(accesoToken, secretKey, (err, user) => {
            if(err){
                res.send('Token expirado o incorrecto. Acceso denegado.');
            }else{
                req.user = user;
                next();
            }
        })
    }
};


app.listen(3000, () => {
    console.log('Servidor levantado en puerto 3000.');
});