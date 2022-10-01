const mongoose = require('mongoose')

mongoose
    .connect('mongodb://host.docker.internal:27017/cinema', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db