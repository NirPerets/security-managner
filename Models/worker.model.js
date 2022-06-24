const mongoose = require('mongoose')
const Schema = mongoose.Schema

const workerSchema = new mongoose.Schema({
    fullName: String,
    phone: String,
    address: String,
    id: String,
    hours: Array,
    x: String,
    y: String,
    status: Boolean,
    job: String,
    trips: [{ type: Schema.Types.ObjectId, ref: 'Trip'}],
    acceptedTrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
    free: Boolean,
});

mongoose.model('Worker', workerSchema)