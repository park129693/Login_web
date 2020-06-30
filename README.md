1. npm을 활용한 프로젝트 초기화
mkdir login_web_complete && cd login_web_complete && npm init -y

프로젝트 구조

image-20200630105518668

#package.json
{
  "name": "login_web_complete",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
"scripts": { "test": "echo "Error: no test specified" && exit 1" },

이곳에 npm <지정명령어> 를 이용해서 긴 내용의 명령어 수행할 수있다.

requir()와 module.exports , import와 export(ecmascript 6) 서로 짝을 이룬다.

npm i express

var express = require('express')
var app  = express()
require('dotenv').config()

const port = process.env.PORT
app.listen(port, function(){
    console.log(`Server is Starting at http://localhost:${port}`)
})
port 처리를 위해서 dotenv를 이용해서 .env등록해서 관리한다.

.env 파일

PORT=8080
app.set() 을 활용해서 처음 세팅을 한다.

view templete 폴더 지정한다.

view engine 지정

static 폴더 지정 static file => CSS , JS image 파일을 지정

...
var path  = require('path')
...
app.set('views' ,path.resolve(__dirname +'/views'))
app.set('view engine' , 'ejs')
...
app.use()을 활용해서 middleware를 등록한다.

....
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));
....
routing 파일을 routes폴더에 만든다.

Router.js

var express = require('express');
var router = express.Router();


router.get('/', function(req, res , next){
    console.log(req)
    next()
})

module.exports = router;
app.js파일에서 Router.js를 import한다.

...
var apiRouter = require('./routes/Router')
...

//routing 파일 미들웨어로 등록
app.use('/', apiRouter)
Router.js 파일에 라우팅 파일을 만단다.

var express = require('express');
var router = express.Router();

var name = {
    a: "김태경",
    b: "홍길동",
    c: "일지매"
}
router.get('/', function(req, res , next){
    console.log(req)
    res.render('index', {data:name})
})
module.exports = router;
res.render('index') : views폴더 안에 있는 index.ejs 파일을 render 한다.

views/index.ejs

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>index</title>
    <link rel="shortcut icon" type="image⁄x-icon" href="http://localhost:8080/favicon.ico">
</head>
<body>
    <h1>안녕하세요 <%= data.a %>님!!!</h1>
</body>
</html>
mongodb cloud를 이용한 DB 연결

app.js에 코드 추가

const mongoose = require('mongoose');



var pw = process.env.PASSWORD

var url = `mongodb+srv://root:${pw}@cluster0-tecvg.mongodb.net/mydb_daejeon?retryWrites=true&w=majority`

mongoose.connect(url,{useNewUrlParser: true , useUnifiedTopology: true} )
mongodb cloud 이용할때 Network Access에서 접속 허용 url 세팅을 해줘야 한다. 그래야지 Rejection이 안된다.

Schema Model 정의를 내리기 위해

models/User.js

var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    passwordHash:{
        type:String,
        required:true
    },
    email:String,
    createAt:{
        type:Date,
        default:Date.now
    }

})


var User = mongoose.model('user', userSchema);
module.exports = User;
routes/Router.js 에 model 파일을 임포트 해서 이용한다.

...
var User = require('../models/User')
...
router.get('/', function(req, res , next){
    User.find((err, result)=>{
        if(err) {
            console.log(err)
        }
        // console.log(req)
        // res.send(result)
        res.render('index', {data:result})
    })
   
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
views/_header.ejs

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Document</title>
</head>
<body>
views/_footer.ejs

<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>

</body>
</html>
routes/Router.js 에 코드 수정

...
var User = require('../models/User')
...
router.get('/', function(req, res , next){
    User.find((err, result)=>{
        if(err) {
            console.log(err)
        }
        // console.log(req)
        // res.send(result)
        res.render('index', {data:result})
    })
   
})
router.post('/signup', (req, res , next)=>{
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

login 기능을 만들기 위해서

routes/Router.js 에 login 라우팅 파일 추가

router.get('/login',(req, res , next)=>{
    res.render('login')
})

router.post('/login',async (req, res, next) => {
        var username = await req.body.username
        var passwordHash = await req.body.passwordHash
        User.findOne({username:username} ,(err,result) =>{
            if(err){
                console.log(err.body)
            }
            if(!result){
                res.send(`${username} is not exist`)
            } else {
                if(result.passwordHash == passwordHash){
                    console.log(username)
                    res.render('index', {data:username})
                }
                else{
                    res.send(`${username}'s password is wrong`)
                }
            }
        })
    })
index.ejs 파일 수정

<%- include('_header.ejs') -%>
    <h1>안녕하세요 <%= data%>님!!!</h1>
   


<%- include('_footer.ejs') -%>