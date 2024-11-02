const Bootcamp = require('../models/bootcamp.model');
const User = require('../models/User.model');

const createBootcamp = async (bootcamp) => {
    const newBootcamp = await Bootcamp.create(bootcamp);
    return newBootcamp;
}
const addUser = async (idUser, idBootcamp) => {
    const bootcamp = await Bootcamp.findByPk(idBootcamp);
    const user = await User.findByPk(idUser);
    await bootcamp.addUser(user);
}

const findById = async (id) => {
    const foundBootcamp = Bootcamp.findByPk(id, {
        include: [User]
    });
    return foundBootcamp;
}

const findAllBootcamps = async () => {
    const bootcampsAndUsers = await Bootcamp.findAll({
        include: [User]
    })
    return bootcampsAndUsers;
}

module.exports = {
    createBootcamp,
    addUser,
    findById,
    findAllBootcamps,
}