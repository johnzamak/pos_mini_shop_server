const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')
const config = require("./config")

const app = express()
const PORT = config.port

var jsonParser = bodyParser.json({ limit: 1024 * 1024 * 2000, type: 'application/json' });
var urlencodedParser = bodyParser.urlencoded({ extended: true, limit: 1024 * 1024 * 20, type: 'application/x-www-form-urlencoding' })

var setup_routes = () => {
    const APP_DIR = `${__dirname}/app`
    const features = fs.readdirSync(APP_DIR).filter(
        file => fs.statSync(`${APP_DIR}/${file}`).isDirectory()
    )
    features.forEach(features => {
        const router = express.Router()
        const routes = require(`${APP_DIR}/${features}/routes.js`)
        routes.setup(router)
        app.use(`/${features}`, router)
    })
}
var setup = () => {
    app.use(cors())
    app.use(jsonParser);
    app.use(urlencodedParser);

    setup_routes(app)

    // app.get('/', (req, res) => {
    //     res.send("test")
    // })

    app.listen(PORT, () => {
        console.log('ready on http://localhost:' + PORT)
    });
}
module.exports = {
    setup: setup
}