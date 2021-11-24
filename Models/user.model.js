const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        reqiured: true
    },
    email: String,
    token: String,
    workers: [{ type: Schema.Types.ObjectId, ref: 'Worker'}],
    trips: [{ type: Schema.Types.ObjectId, ref: 'Trip'}]
});

mongoose.model('User', userSchema)