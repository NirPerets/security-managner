const express = require('express')
const auth = require('../Middleware/authJWT')
var router = express.Router()
const mongoose = require('mongoose')
const Trip = mongoose.model('Trip')
const User = mongoose.model('User')

router.post('/', (req, res) => { // Get all trips
    Trip.find((err, docs) => {
        if(!err) {
            res.send({trips : docs})
        } else {
            console.log('ERROR Getting list trips - ' + err)
        }
    })
})

router.post('/', (req, res) => {
    insertRecord(req, res)
})

router.post('/companyTrips', auth, (req,res) => {
    User.findById(req.body.id, (err, user) => {
        if(err || !user) res.status(403)
        else {
            res.send({trips: user.trips})
        }
    })
})

router.post('/:id', (req, res) => {
    Trip.findById(req.params.id, (err, doc) => {
        if(!err) {
            res.send({ trip: doc })
        } else {
            console.log("error getting trip - " + err)
        }
    })
})

router.post("/delete/:id", (req, res) => {
    Trip.findByIdAndRemove(req.params.id, (err, doc) => {
        if(!err) {
            doc.guards.forEach(item => {
                Guard.findOneAndUpdate({ _id: item }, { $pull: { trips : { _id : doc._id} }}, (err) => {
                    if(err) {
                        console.log(err + ' - ' + item)
                    }
                })
            })

            doc.medics.forEach(item => {
                Medic.findOneAndUpdate({ _id: item }, { $pull: { trips : { _id : doc._id} }}, (err) => {
                    if(err) {
                        console.log(err + ' - ' + item)
                    }
                })
            })

            res.send({success: true})
        } else {
            console.log('ERROR in deletion - ' + err)
        }
    })
})

function insertRecord(req, res) {
    let trip = new Trip();
    trip.body = req.body.body
    trip.school = req.body.school
    trip.class = req.body.class
    trip.city = req.body.city
    trip.address = req.body.address
    trip.area = req.body.area
    trip.startDate = req.body.startDate
    trip.finishDate = req.body.finishDate
    trip.hour = req.body.hour
    trip.guards = req.body.guards
    trip.medics = req.body.medics
    trip.status = req.body.status
    trip.contact = req.body.contact
    trip.meetAddress = req.body.meetAddress
    
    trip.save((err, doc) => {
        if(!err) {
            req.body.guards.forEach(item => {
                Guard.findOneAndUpdate({ _id: item }, { $push: { trips : doc }}, (err) => {
                    if(err) {
                        console.log(err + ' - ' + item)
                    }
                })
            })
            req.body.medics.forEach(item => {
                Medic.findOneAndUpdate({ _id: item }, { $push: { trips : doc }}, (err) => {
                    if(err) {
                        console.log(err + ' - ' + item)
                    }
                })
            })
            res.send({success: true})
        } else {
            console.log('ERROR Saving record - ' + err)
        }
    })
}

function updateRecord(req, res) {
    Trip.findOneAndUpdate(
        { _id: req.body._id },
        req.body,
        {new: true},
        (err, doc) => {
            if(!err) {
                res.send({success: true})
            } else {
                console.log('ERROR UPDATE RECORD - ' + err)
            }
        }
    )
}

module.exports = router