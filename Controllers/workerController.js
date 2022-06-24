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

router.post('/:id/free', (req, res) => {
    Worker.updateOne(
        { _id: req.params.id},
        { free: true},
        (err, result) => {
            if(err) console.log(err)
            else return res.status(200).send()
        }
    )
})

router.post('/:id/towork', (req, res) => {
    Worker.updateOne(
        { _id: req.params.id},
        { free: false},
        (err, result) => {
            if(err) console.log(err)
            else return res.status(200).send()
        }
    )
})

router.post('/:id/acceptTrip', (req, res) => {
    Worker.updateOne(
        { _id: req.params.id },
        { $push : { acceptedTrips : req.body.trip }},
        (err, result) => {
            if(err) console.log(err)
            else {
                return res.status(200).send()
            }
        }
    )
})

module.exports = router