var express = require('express');
var router = express.Router();

var name = {
    a: "고객",
    b: "바둑이",
    c: "영희"
}
router.get('/', (req, res, next)=>{
    console.log(req)
    res.render('index', {data:name})
})

module.exports = router;