const request = require('request');
const express = require("express");
const route = express.Router();
const https = require('https');
const axios = require('axios');
const movie=require("../models/Moviedata.js");



module.exports.fillData=async function(req,res){
    let id=req.body.id;
   let api3=`https://api.themoviedb.org/3/discover/movie?api_key=19dedc791dc255982eaf84be8a93012a&with_genres=${id}&page=1`;
   let api2=`https://api.themoviedb.org/3/discover/movie?api_key=19dedc791dc255982eaf84be8a93012a&with_genres=${id}&page=2`;
   let api1=`https://api.themoviedb.org/3/discover/movie?api_key=19dedc791dc255982eaf84be8a93012a&with_genres=${id}&page=3`;

   let response3 = await axios.get(api3);
   let response2= await axios.get(api2);
   let response1=await axios.get(api1);
    
   let docs=[];
   if(response3.data.results.length>0){
   for(let itr of response3.data.results){
    let check=await movie.findOne({title:itr.title});
      if(check== null){
      let obj1= {title:itr.title,vote_average:itr.vote_average,genre_id:id,poster_path:itr.poster_path,overview:itr.overview}
         docs.push(obj1);
      }
    }
}

if(response2.data.results.length>0){
 for(let itr of response2.data.results){
    let check=await movie.findOne({title:itr.title});
    if(check== null){
        let obj1= {title:itr.title,vote_average:itr.vote_average,genre_id:id,poster_path:itr.poster_path,overview:itr.overview}
           docs.push(obj1);
        }
  }
}

if(response1.data.results.length>0){
 for(let itr of response1.data.results){
    let check=await movie.findOne({title:itr.title});
    if(check== null){
        let obj1= {title:itr.title,vote_average:itr.vote_average,genre_id:id,poster_path:itr.poster_path,overview:itr.overview}
           docs.push(obj1);
        }
 }

}


let pushmovies=await movie.insertMany(docs);

  res.send(pushmovies);
}

