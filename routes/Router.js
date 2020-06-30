var express = require('express');
var router = express.Router();
var User = require('../models/User')

var name = {
    a: "철수",
    b: "바둑이",
    c: "영희"
}
router.get('/', (req, res, next)=>{
    User.find((err, result)=>{
        if(err) {
            console.log(error)
        }
        // console.log(req)
        //res.send(result)
        res.render('index', {data:result})
    })

})

router.get('/signup', (req, res, next)=>{
    res.render('signup')
})

router.post('/signup',(req, res, next)=>{
    console.log(req.body.id.inputname)
})

router.post('/insert', (req, res, next)=>{

    var contact = new User()
    contact.username = req.body.username
    contact.passwordHash = req.body.passwordHash
    contact.email = req.body.email
    
    contact.save((err, result)=>{
        if(err) {
            console.log(err)
        }
        console.log(result)
        res.send("Success")
    })

})

module.exports = router;