import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import fs from 'fs'
import path, { join } from 'path'
import routes from './routes'
import cors from 'cors'
import verifyToken from './middleware/auth'

const app = express()

global.__basedir = __dirname;

// var corsOptions = {
//     origin: "http://localhost:3000"
// };

// const accessLogStream = fs.createWriteStream(
//     path.join(__dirname, '../access.log'),
//     { flags: 'a'}
// )

// app.use(cors(corsOptions));
app.use(cors());
app.use(helmet())
// app.use(morgan('combined', { stream: accessLogStream}))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended: true, limit: '50mb'}))

app.use('/uploads', express.static(__basedir + '/uploads'))
app.use('/user', routes.user)
app.use('/product', verifyToken, routes.product)
app.use('/auth', routes.auth)

app.use((req, res) => {
    res.status(400).send({
        message: `404: Page not found`,
        code: '400',
        data: []
    })
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening on port ${process.env.PORT}`)
})


