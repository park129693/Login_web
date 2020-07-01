var mongoose = require('mongoose')

var BoardSchema = mangoose.Schema({
    no:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    edit:{
        type:String,
        required:true
    },
    email:String,
    createAt:{
        type:Date,
        default:Date.now
    }
})