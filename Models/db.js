const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/tripManager', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if(!err) {
        console.log('Connection Success')
    } else {
        console.log('ERROR in connection of DB - ' + err)
    }
})

require('./trip.model')
require('./worker.model')
require('./user.model')