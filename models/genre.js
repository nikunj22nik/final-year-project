const mongoose = require("mongoose");
const genreSchema= new mongoose.Schema({

    genre_id:{
    type:Number,
    required:true
   },
    genre_name:{
    type:String,
    unique:true,
    required:true   
    }


})

const Genre=mongoose.model("genre",genreSchema);
module.exports=Genre;
