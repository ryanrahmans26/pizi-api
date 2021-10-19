const db = require('../models')
const User = db.rest.models.user
import jwt from 'jsonwebtoken'

exports.getAllUser = async (req, res) => {

    console.log("user_id = " + req.user.user_id)

    const user = await User.findAll()

    return res.send({
        message: 'Success',
        code: '200',
        data: user
    })
}

exports.getUser = async (req, res) => {
    const {id} = req.params

    const user = await User.findOne({
        where: {
            id
        }
    })

    if (!user) {
        return res.status(400).send( {
            message: `No user found with the ${id}`,
            code: '400',
            data: []
        })
    }

    return res.send({
        message: 'Success',
        code: '200',
        data: user
    })
}

exports.createUser = async (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).send( {
            message: `You need include username and password to create a user`,
            code: '400',
            data: []
        })
    }

    let usernameExists = await User.findOne({
        where: {
            username
        }
    })

    if (usernameExists) {
        return res.status(400).send( {
            message: `A user with this ${username} already exists`,
            code: '400',
            data: []
        })
    }

    try {
        let newUser = await User.create({
            username,
            password,
        })

        const token = jwt.sign(
            {user_id: newUser.id, username},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        )

        newUser.token = token

        return res.send({
            message: 'Success',
            code: '200',
            data: newUser
        })
    } catch(err) {
        return res.status(500).send( {
            message: `Error ${err.message}`,
            code: '500',
            data: []
        })
    }
}

exports.updateUser = async (req, res) => {
    const {username, password} = req.body

    const {id} = req.params

    const user = await User.findOne({
        where: {
            id
        }
    })

    if (!user) {
        return res.status(400).send( {
            message: `No exists user with id ${id}`,
            code: '400',
            data: []
        })
    }

    try {
        if (username) {
            user.username = username
        }
        if (password) {
            user.password = password
        }
        user.save()

        return res.send({
            message: `User ${id} has been updated`,
            code: '200',
            data: []
        })
    } catch(err) {
        return res.status(500).send( {
            message: `Error ${err.message}`,
            code: '500',
            data: []
        })
    }
}

exports.deleteUser = async (req, res) => {
    const {id} = req.params

    if(!id) {
        return res.status(400).send( {
            message: `Please provide the ID the user you want to delete`,
            code: '400',
            data: []
        }) 
    }

    const user = await User.findOne({
        where: {
            id
        }
    })

    if (!user) {
        return res.status(400).send( {
            message: `No exists user with id ${id}`,
            code: '400',
            data: []
        })
    }

    try {
        await user.destroy()
        return res.send({
            message: `User id ${id} has been deleted`,
            code: '200',
            data: []
        })
    } catch(err) {
        return res.status(500).send( {
            message: `Error ${err.message}`,
            code: '500',
            data: []
        })
    }
}