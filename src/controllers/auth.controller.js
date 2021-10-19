const db = require('../models')
const User = db.rest.models.user
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'


exports.login = async (req, res) => {
    const {username, password} = req.body

    if (!username || !password) {
        return res.status(400).send( {
            message: `Username & password need to login`,
            code: '400',
            data: []
        })
    }

    try {
        let user = await User.findOne({username})

        if (user === null) {
            return res.status(400).send( {
                message: `User with Username ${username} not already exists`,
                code: '400',
                data: []
            })
        }

        if (user && compare(password, user.password)) {
            const token = jwt.sign(
                {user_id: user.id, username},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            )

            user.update({token: token})

            return res.send({
                message: 'Success',
                code: '200',
                data: user
            })
        }

        return res.status(500).send( {
            message: `Invalid credentials`,
            code: '400',
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
