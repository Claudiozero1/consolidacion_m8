require('dotenv').config();


const express = require('express');
const { createUser, findUserById, findAllUsers, updateUserById, deleteUserById } = require('./src/controllers/user.controller');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('./src/models/User.model');
const sequelize = require('./src/config/db.config')
const verifyAccesApi = require('./src/middleware/verifyToken');
const { createBootcamp, addUser, findById, findAllBootcamps } = require('./src/controllers/bootcamp.controller');
const cookieParse = require('./src/middleware/cookieParse');

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParse)



// REGISTRO
app.post('/api/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    // const exist = await User.findOne({
    //     where: { email },
    // });

    // if (exist.dataValues.email === email) {
    //     return res.json('El correo proporcionado ya esta en uso')
    // } else {
    // }
    const encripted = await bcrypt.hash(password, 10)
    const user = await createUser({ firstName, lastName, email, password: encripted })
    return res.status(200).json(user);
})

// INICIO DE SESION
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        where: { email },
    });

    const isValid = await bcrypt.compare(password, user?.password || 'default');

    if (!user || !isValid) {
        return res.status(400).json({
            error: 'Los datos son incorrectos'
        })
    }

    const token = jwt.sign({ user_id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '30m', });

    res.cookie('token', token, { httpOnly: true, secure: true })

    res.status(200).json({ token });
})

// LISTA INFORMACION DEL USUARIO SEGUN SU ID
app.get('/api/user/:id', verifyAccesApi, async (req, res) => {
    const { id } = req.params
    const user = await findUserById(id);
    res.status(200).json({ user });
})

// LISTA INFORMACION DE TODOS LOS USUARIOS Y BOOTCAMPS
app.get('/api/user', verifyAccesApi, async (req, res) => {
    const info = await findAllUsers();
    res.status(200).json({ info });
})

// ACTUALIZA firstName y lastName
app.put('/api/user/:id', verifyAccesApi, async (req, res) => {
    const { id } = req.params
    const { firstName, lastName } = req.body
    const editUser = await updateUserById(id, { firstName: firstName, lastName: lastName });
    res.status(200).json({ editUser })
})

// ELIMINAR USUARIO
app.delete('/api/user/:id', verifyAccesApi, async (req, res) => {
    const { id } = req.params
    const deletedUser = await deleteUserById(id)
    res.status(200).json({ deletedUser });
})

// CREAR BOOTCAMP
app.post('/api/bootcamp', verifyAccesApi, async (req, res) => {
    const { title, cue, description } = req.body
    const bootcamp = await createBootcamp({ title, cue, description })
    res.status(200).json({ bootcamp });
})

// AGREGAR USUARIO A BOOTCAMP
app.post('/api/bootcamp/adduser', verifyAccesApi, async (req, res) => {
    const { idUser, idBootcamp } = req.body
    const assigned = await addUser(idUser, idBootcamp);
    res.status(200).json({ assigned });
})

// LISTA INFORMACION DE LOS BOOTCAMPS Y USUARIOS
app.get('/api/bootcamp/:id', verifyAccesApi, async (req, res) => {
    const { id } = req.params
    const info = findById(id);
    res.status(200).json({ info });
})

// LISTA TODOS LOS BOOTCAMPS
app.get('/api/bootcamp', verifyAccesApi, async (req, res) => {
    const bootcamps = await findAllBootcamps()
    res.status(200).json({ bootcamps });
})


// SERVER
const main = async () => {
    try {
        await sequelize.sync({ alter: true });
        app.listen(3000, () => {
            console.log("Servidor escuchando en http://localhost:3000/");
        });
    } catch (error) {
        console.log(error);
    }
};

main();