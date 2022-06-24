const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tripSchema = new mongoose.Schema({
    body: String,
    school: String,
    class: String,
    city: String,
    address: String,
    x: String,
    y: String,
    area: String,
    startDate: String,
    finishDate: String,
    hour: String,
    contact: String,
    guards: [{ type: Schema.Types.ObjectId, ref: 'Worker'}],
    medics: [{ type: Schema.Types.ObjectId, ref: 'Worker'}],
    status: Boolean,
    sleep: String,
    email: String,
});

mongoose.model('Trip', tripSchema)