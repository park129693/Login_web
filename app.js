var express = require('express')
var app = express()
require('dotenv').config()
var path = require('path')
require('ejs')
var apiRouter = require('./routes/Router')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise
var flash = require("express-flash-messages")
var cookieParser = require('cookie-parser')
var session = require('express-session')
var passport = require('passport')
var User = require('./models/User')

var pw = process.env.PASSWORD
var url = `mongodb+srv://root:${pw}@cluster0.ze1q8.mongodb.net/MyDB_Daejeon?retryWrites=true&w=majority`
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

app.set('views' ,path.resolve(__dirname +'/views'))
app.set('view engine', 'ejs')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.use(cookieParser())
app.use(session({
    secret:"fhweohfowejh",
    resave:true,
    saveUninitialized:true
}))

app.use(flash())

//passprot
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done)=>{
    done(null, user._id)
})

passport.deserializeUser((userId, done)=>{
    User.findById(userId, (err, user)=>{
        done(err, user)
    })
})

var localStrategy = require("passport-local")
var local = new localStrategy((username, password, done)=>{
    User.findOne({username})
    .then(user =>{
        if(!user || user.validPassword(password)) {
            done(null, false, {meassage:"Invalid username /password"})
        } else {
            done(null, user)
        }
    })
    .catch(e=>done(e))
})

passport.use("local", local)
//routin 파일 미들웨어로 등록
app.use('/', apiRouter(passport))

const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`Server is Starting at http://localhost:${port}`)
})