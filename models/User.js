var mangoose = require('mongoose')

var userSchema = mangoose.Schema({
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

var User = mangoose.model('user', userSchema)
module.exports = User;