const express = require('express')
var router = express.Router()
const auth = require('../Middleware/authJWT')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Worker = mongoose.model('Worker')
const Trip = mongoose.model('Trip')
var axios = require('axios');
const sendSMS = require('../Functions/sms')

router.post('/:id', auth ,(req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err | !user) res.status(403)
        else res.status(200).send({ user: user })
    })
})

router.post('/:id/addTrip', auth , async (req, res) => {
    const wazeUrl = 'https://www.waze.com/live-map/directions?navigate=yes&to=ll.' + req.body.x + '%2C' + req.body.y
    const moovitUrl = 'https://moovit.com/?to=tll=' + req.body.x + '_' + req.body.y + '&lang=he'

    const trip = new Trip()

    trip.body = req.body.body
    trip.school = req.body.school
    trip.class = req.body.class
    trip.city = req.body.city
    trip.address = req.body.address
    trip.area = req.body.area
    trip.startDate = req.body.startDate
    trip.finishDate = req.body.finishDate
    trip.hour = req.body.hour
    trip.contact = req.body.contact
    trip.meetAddress = req.body.meetAddress
    trip.guards = req.body.guards
    trip.medics = req.body.medics
    trip.x = req.body.x
    trip.y = req.body.y 
    trip.status = false
    trip.email = req.body.email
    trip.sleep = req.body.sleep
    
    await trip.guards.forEach(async guard => {
        Worker.updateOne(
            { _id : guard },
            { $push: { trips : trip}},
            (err => res.status(403))
        )
        let guardToSend = await Worker.findOne({ _id : guard})
        await sendSMS(trip, guardToSend)
    })

    await trip.medics.forEach(async medic => {
        Worker.updateOne(
            { _id : medic },
            { $push: {trips: trip}},
            (err => res.status(403))
        )
        let medicToSend = await Worker.findOne({ _id : medic})
        await sendSMS(trip, medicToSend)
    })

    trip.save((err, trip) => {
        if(!err) {
            User.updateOne(
                { _id: req.params.id },
                { $push: { trips: trip._id }},
                (err) => {
                    if(err) res.status(403).send()
                    else res.status(200).send()
                }
            )
        }
    })
})

router.post('/:id/newWorker', (req, res) => {
    let worker = new Worker()
    worker.fullName = req.body.name
    worker.status = false
    worker.phone = req.body.phone
    worker.address = req.body.address
    worker.id = req.body.id
    worker.job = req.body.job
    worker.x = req.body.x
    worker.y = req.body.y

    worker.save((err, worker) => {
        if(!err) {
            User.updateOne(
                { _id: req.params.id },
                { $push : {workers : worker._id}},
                (err) => {
                    if(err) res.status(403).send()
                    else res.status(200).send()
                } 
            )
        }
    })
})

router.post('/:id/deleteWorker', async (req, res) => {
    Worker.findOne(
        { _id : req.body.id },
        (err, worker) => {
            if(err) console.log(err)
            else {
                if(worker.trips.length > 0) return res.status(403).send('trips')
                else {
                    User.updateOne(
                        { _id: req.params.id },
                        { $pull: { workers : mongoose.Types.ObjectId(req.body.id) }},
                        { multi : false },
                        (err) => {
                            if(err) res.status(403).send()
                            else {
                                Worker.remove({ _id: req.body.id }, (err, result) => {
                                    if(err) return res.status(403)
                                })
                                res.status(200).send()
                            }
                        }
                    )
                }
            }
        }
    )
})


router.post('/:id/deleteTrip', (req, res) => {
    console.log(req.body.id)
    User.updateOne(
        { _id : req.params.id },
        { $pull: {trips : req.body.id }},
        { multi : false},
        async (err, result) => {
            if(err) res.status(403).send()
            else {
                const trip = await Trip.findOne({ _id : req.body.id })
                trip.guards.forEach(guard => {
                    Worker.updateOne(
                        { _id: guard },
                        { $pull: { trips : mongoose.Types.ObjectId(req.body.id) }},
                        { multi: false },
                        err => {
                            if(err) console.log(err)
                        }
                    )
                })
                trip.medics.forEach(medic => {
                    Worker.updateOne(
                        { _id: medic },
                        { $pull: { trips : mongoose.Types.ObjectId(req.body.id) }},
                        { multi: false },
                        err => {
                            if(err) console.log(err)
                        }
                    )
                })
                Trip.remove({ _id: req.body.id }, (err, result) => {
                    if(err) return res.status(403)
                })
                res.status(200).send()
            } 
        }
    )
})

router.post('/getTrip', (req, res) => {
    Trip.findById(req.body.id, (err, trip) => {
        if (err) return res.status(403)
        else {
            return res.status(200).send(trip)
        }
    })
})

router.post('/:id/getWorkers', (req, res) => {
    User.findById(
        req.params.id,
        (err, user) => {
            if(!err) {
                Promise.all(user.workers.map(worker => {
                    return Worker.findOne({ _id : worker }).exec()
                })).then(foundWorkers => {
                    return res.status(200).send(foundWorkers)
                })
            } else console.log(err)
        }
    )
})

router.post('/:id/getTrips', (req, res) => {
    User.findById(
        req.params.id,
        (err, user) => {
            if(!err) {
                Promise.all(user.trips.map(trip => {
                    return Trip.findOne({ _id : trip }).exec()
                })).then(foundTrips => {
                    return res.status(200).send(foundTrips)
                })
            } else console.log(err)
        }
    )
})

router.post('/:id/getWorkersTrips', (req, res) => { // GET ALL WORKER WITH THEIR TRIPS
    User.findById(
        req.params.id,
        (err, user) => {
            if(!err) {
                return Promise.all(user.workers.map(worker => {
                    return Worker.findOne({ _id : worker }).exec()
                    .then(worker => {
                        return Promise.all(worker.trips.map(trip => {
                            return Trip.findOne({ _id : trip}).exec()
                        }))
                        .then(foundTrips => {
                            worker.trips = foundTrips
                            return worker
                        })
                    })
                }))
                .then(foundWorkers => {
                    return res.status(200).send(foundWorkers)
                })
            } else console.log(err)
        }
    )
})

router.post('/:id/getTripWorkers', (req, res) => { // GET SPECIFIC TRIP WORKERS
    let guards = []
    let medics = []

    Trip.findOne(
        { _id: req.body.id },
        async (err, trip) => {
            if(!err) {
                await Promise.all(trip.guards.map(guard => {
                    return Worker.findOne({ _id : guard }).exec()
                })).then(foundGuards => {
                    guards = foundGuards
                })

                Promise.all(trip.medics.map(medic => {
                    return Worker.findOne({ _id : medic }).exec()
                })).then(foundMedics => {
                    medics = foundMedics
                }).then(() => {
                    return res.status(200).send({
                        guards : guards,
                        medics : medics
                    })
                })
            }
        }
    )
})

router.post('/:id/getWorkerTrips', (req, res) => { // GET SPECIFIC WORKER TRIPS
    Worker.findOne(
        { _id : req.body.id },
        (err, worker) => {
            if(!err) {
                Promise.all(worker.trips.map(trip => {
                    return Trip.findOne({ _id : trip}).exec()
                })).then(foundTrips => {
                    res.status(200).send(foundTrips)
                })
            }
        }
    )
}) 

router.post('/:id/:trip', async (req, res) => {
    const update = {
        class: req.body.class,
        city: req.body.city,
        startDate: req.body.startDate,
        finishDate: req.body.finishDate,
        hour: req.body.hour,
        address: req.body.address,
        contact: req.body.contact,
        email: req.body.email,
        sleep: req.body.sleep,
        guards: req.body.guards,
        medics: req.body.medics
    }

    await req.body.newWorkers.forEach(worker => {
        Worker.updateOne(
            { _id: worker._id },
            { $push: { trips: mongoose.Types.ObjectId(req.params.trip) }},
            (err, res) => {
                if(err) return res.status(403).send('error')
                else console.log(res)
            }
        )
    })

    await req.body.workersToDelete.forEach(worker => {
        Worker.updateOne(
            { _id: worker._id },
            { $pull: { trips: mongoose.Types.ObjectId(req.params.trip) }},
            err => {
                if(err) return res.status(403).send('error')
            }
        )
    })

    Trip.findOneAndUpdate(
        { _id : req.params.trip },
        update,
        (err, trip) => {
            if(!err) return res.status(200).send(trip)
        }
    )
})

router.post('/:id/checkMobile', async (req, res) => {
    const worker = await Worker.findById('618e56069ce72836b04e7f9f')
    const trip = await Trip.findById('618e417d390d61313ccbd6b6')

    let xml = await createTripMessage(trip, worker)

    //let url = 'https://api.upsend.co.il/inforufrontend/WebInterface/SendMessageByNumber.aspx?UserName=UPSEND13543&ApiToken=676939a8-2888-4a18-a1f8-cb0edd9b050c&SenderCellNumber=0001&CellNumber=+9720503036431&MessageString=' + message
    const url = 'http://uapi.upsend.co.il/SendMessageXml.ashx'

    const headers = {
        'Content-Type' : 'text/xml; charset=utf-8'
    }

    axios.post(url, null, { params: { InforuXML : xml } })
    .then(result => console.log(result.data))

    return res.status(200)
})

module.exports = router