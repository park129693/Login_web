var express = require('express');
var router = express.Router();
var User = require('../models/User')

var name = {
    a: "철수",
    b: "바둑이",
    c: "영희"
}
router.get('/', (req, res, next)=>{
    console.log(req)
    res.render('index', {data:name})
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