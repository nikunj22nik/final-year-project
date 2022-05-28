const mongoose = require("mongoose");

const popularSchema = new mongoose.Schema({
  adult: {
    type: String,
    required: false,
    unique: false,
  },
  backdrop_path: {
    type: String,
    required: true,
    unique: false,
    original_language: {
      type: String,
      required: true,
      unique: false,
    },
    original_title: {
      type: String,
    },

    popularity: {
      type: Number,
    },
    overview:{
        type:String
    },
    poster_path: {
      type: String,
    },
    release_date: {
      type: Date,
    },
    title: {
      type: String,
    },
    vote_average: {
      type: String,
    },
  },
});

const Popular=mongoose.model("popular",popularSchema);
module.exports=Popular;
