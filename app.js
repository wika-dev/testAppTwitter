const express = require('express')
const morgan = require('morgan')
const path = require('path')
const index = require('./routes')
const errorHandler = require('errorhandler')
require('./database')

const app = express()
module.exports = app

app.set('views', (__dirname, 'views'))
app.set('view engine', 'pug')

require('./config/session.config')
require('./config/passport.config')

app.use(morgan('short')) //affiche log dans la console
app.use(express.static(path.join(__dirname, 'public'))) // Midlleware qui repére a chaque fois un fichier que l'on veut recup et le retourne
app.use(express.json()) // recup toute req de type post et de parsée la data et la possitioner sur une key de req
app.use(express.urlencoded({ extended: true })) // recup la data de type post (extended: true encode de donné complexe )
app.use(index)

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
    app.use(errorHandler())
} else {
    app.use((err, req, res, next) => {
        const code = err.code || 500
        res.status(code || 500).json({
            code: code,
            message: code === 500 ? null : err.message
        })
    })
}

