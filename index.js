require('./Models/db')

const express       = require('express')
const bodyparser    = require('body-parser')
const session       = require('express-session')
const bcrypt        = require('bcrypt-nodejs')
const passport      = require('passport')
const localStrategy = require('passport-local').Strategy
const cors          = require('cors')
const jwt           = require("jsonwebtoken");
const auth          = require('./Middleware/authJWT')
const schedule      = require('node-schedule')
const path          = require('path')

require('dotenv').config();

const mongoose = require('mongoose')
const User = mongoose.model('User')
const Worker = mongoose.model('Worker')
const Trip = mongoose.model('Trip')

const tripController = require('./Controllers/tripController')
const workerController = require('./Controllers/workerController')
const userController = require('./Controllers/user.controller')

const Login = require('./Routes/Login/login')

/* ================== END OF LIBRARIES ===================== */

/* ================== USES =========================== */

const app = express();
const port = process.env.PORT || 5000

app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())

app.use(session({
  secret: 'verygoodsecret',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(express.static(path.join(__dirname, "./client/build")))

/* ================== PASSPORT =========================== */

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})



app.post('/register', async (req, res) => {
  const exists = await User.exists({ username: req.body.username })

  if(exists) {
    res.send({message: 'User already exists'})
    return
  }

  bcrypt.genSalt(10, (err, salt) => {
    if(err) return next(err)
    bcrypt.hash(req.body.password, salt,null, (err, hash) => {
      if(err) return next(err)

      const token = jwt.sign(
        { email : req.body.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        token: token
      })

      newUser.save()

      res.send({message: 'Registration Success'})
    })
  })
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username : username });

  await bcrypt.compare(password, user.password, (err, result) => {
    if (err) console.log(err)
    else {
      if (user) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, username },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
    
        // save user token
        user.token = token;
    
        // user
        res.status(200).json(user)
      } else {
        res.status(400).send("Invalid Credentials");
      }
    }
  })

})

app.get('/logged_in', auth,  (req, res) => {
  res.status(200).send("Logged");
})

/* ================== Routes =========================== */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './client/build', 'index.html')) 
})

app.listen(port, () => {
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
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/check', (req, res) => {
  res.send({express: 'EXPRESS BACKEND CONNECTED'})
})

app.post('/register', (req, res) => {
  console.log(req.body)
})

/* ===================== SHECDULED ===================== */

const updateTripStatus = schedule.scheduleJob('0 0 * * *', async () => {
  const today = new Date()

  await Trip.find({}, (err, trips) => {
    if(err) console.log(err)
    else {
      trips.forEach(trip => {
        const startDateSplit = trip.startDate.split('/')
        const finishDateSplit = trip.finishDate.split('/')

        if (startDateSplit[1] == finishDateSplit[1]) {
            if (today.getDate() >= startDateSplit[0] && today.getDate() <= finishDateSplit[0]) {
              trip.status = true
              trip.save()
            } 
            else return
        } else {
            if (today.getDate() >= startDateSplit[0] && today.getMonth() == (startDateSplit[1] - 1) || today.getDate() <= finishDateSplit[0] && today.getMonth() == (finishDateSplit[1] - 1)) {
              trip.status = true
              trip.save()
            }
            else return
        }
      })
    }
  })

  Worker.find({}, (err, workers) => {
    if (err) console.log(err)
    else {
      workers.forEach(worker => {
        worker.trips.every(trip => {
          Trip.find({ _id : trip}, (err, resultedTrip) => {
            if(err) console.log(err)
            else {
              if(trip.status === true) {
                worker.status = true
                worker.save()
                return false
              }
            }
          })
        })
      })
    }
  })
})

app.use('/login', Login)
app.use('/trips', tripController)
app.use('/worker', workerController)
app.use('/user', userController)
