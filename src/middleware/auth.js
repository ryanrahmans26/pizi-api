const jwt = require("jsonwebtoken")

const config = process.env;

const verifyToken = (req, res, next) => {
    let token = req.headers.authorization
    
    if (!token) {
        return res.status(403).send( {
            message: `A token is required for authentication`,
            code: '403',
            data: []
        })
    }

    token = token.replace(/^Bearer\s+/, "")

    try {
        console.log(token)
        const decoded = jwt.verify(token, config.TOKEN_KEY)
        req.user = decoded
    } catch(err) {
        return res.status(401).send( {
            message: `Invalid Token`,
            code: '500',
            data: []
        })
    }

    return next()
}

module.exports = verifyToken