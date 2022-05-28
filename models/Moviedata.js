const mongoose = require("mongoose");

const movieSchema=new mongoose.Schema({
   title:{
      type:String,
      unique:true
   },
   vote_average:{
      type:String
   },
   genre_id:{
      type:Number,
      unique:false
    },
    poster_path:{
        type:String
    },
    overview:{
        type:String
    },
    visited:{
        type:Boolean,
        default:false
    },count:{
        type:Number,
        default:0
    }
})

const Moviedata=mongoose.model("moviedata",movieSchema);
module.exports=Moviedata;