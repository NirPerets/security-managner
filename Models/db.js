const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://turismo:9976406@turismo.edfha.mongodb.net/Turismo?retryWrites=true&w=majority', {
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