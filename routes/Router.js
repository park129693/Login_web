var express = require('express');
var router = express.Router();
var User = require('../models/User')
var List = require('../models/List')
var bcrypt = require('bcryptjs')

function loggedInOnly(req, res, next) {
    if(req.isAuthenticated()) {
        next()
    }
    res.redirect('/login')
}

function loggedOutOnly(req, res, next) {
    if(req.isUnauthenticated()) {
        next()
    }
    res.send('sdfsdfdsfsdfsdf')
}

function authenticate(passport) {
    
    router.use((req, res, next)=>{
        res.locals.currentUser = req.user
        console.log(res.locals.currentUser)
        next()
    })


    router.get('/', loggedInOnly,  (req, res, next)=>{
        User.find((err, result)=>{
            if(err) {
                console.log(error)
            }
            // console.log(req)
            //res.send(result)
            res.render('index', {data:result})
        })

    })

    router.get('/signup', loggedOutOnly,(req, res, next)=>{
        res.render('signup', {message:"ture"})
    })

    router.post('/signup', loggedOutOnly, async (req, res , next)=>{
            var username = await req.body.username
            var passwordHash = await req.body.passwordHash
            var email = await req.body.email
            console.log(bcrypt.compareSync(req.body.passwordHash,passwordHash ))

        User.findOne({username :req.body.username} ,(err, user)=>{
            if(err) {
                console.log(err)
            } 
            if(user) {
                console.log(user)
                res.render('signup',  {message:"false" ,data:user.username})
            } 
            
            User.create({ username,passwordHash, email })
            .then(user=>{
                req.login((user, err)=>{
                    if(err) {
                        next(err)
                    } else {
                        res.redirect('/main')
                    }
                })
            })
            .catch(e=> {
                if(e.name == "ValidationError") {
                    res.redirect("/signup")
                }
                next(e);
            })
        })         
    })


    router.get('/login', loggedOutOnly,(req, res , next)=>{
        res.render('login')
    })

    router.post('/login', loggedOutOnly ,

        passport.authenticate("local", {
            successRedirect:"/main",
            failureRedirect:'login',
            failureFlash:true
        })
    //     async (req, res, next) => {
    //     var username = await req.body.username
    //     var passwordHash = await req.body.passwordHash
    //     User.findOne({username:username} ,(err,result) =>{
    //         if(err){
    //             console.log(err.body)
    //         }
    //         if(!result){
    //             res.send(`${username} is not exist`)
    //         } else {
    //             if(result.passwordHash == passwordHash){
    //                 console.log(username)
    //                 res.render('index', {data:username})
    //             }
    //             else{
    //                 res.send(`${username}'s password is wrong`)
    //             }
    //         }
    //     })
    // }
    )

    router.get('/main', loggedInOnly,(req, res, next)=>{
        List.find((err, result)=>{
            if(err) {
                console.log(err)
                res.status(500).send("Interenal is delay!!")
            }
            console.log(result[0].title)
            res.render('main', {data:result})
        })
    })

    router.get('/insert', loggedInOnly, (req, res, next)=>{
        res.render('insert')
    })

    router.post('/insert', loggedInOnly, (req, res, next)=>{
        var contact = new List()
        contact.title = req.body.title
        contact.description = req.body.description
        contact.email = req.body.email
        contact.author = req.body.author
        
        contact.save((err, result)=>{
            if(err) {
                console.log(err)
            }
            console.log(result)
            res.redirect("/main")
        })
    })

    router.all("/logout",(req, res, next)=>{
        req.logout()
        res.redirect('/login')
    })

    //Error Handler
    router.use((err, req, res)=>{
        console.error(err.stack)
    })   
    
    return router
}

module.exports = authenticate;