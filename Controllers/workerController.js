const express = require('express')
var router = express.Router()
const mongoose = require('mongoose')
const Worker = mongoose.model('Worker')
const Trip = mongoose.model('Trip')

router.post('/login', (req, res) => {
    Worker.findOne({
        id: req.body.id,
        phone: req.body.phone
    }, (err, worker) =>{
        if(err || worker === null) return res.status(403).send('עובד לא נמצא')
        else return res.status(200).send(worker)
    })
})

router.post('/:id', (req, res) => {
    Worker.findOne({ _id: req.params.id }, (err, worker) => {
        if(err) return res.status(403).send()
        else {
            Promise.all(worker.trips.map(trip => {
                return Trip.findOne({ _id : trip}).exec()
            })).then(foundTrips => {
                return res.status(200).send({ worker : worker, trips : foundTrips })
            })
        }
    })
})

module.exports = router