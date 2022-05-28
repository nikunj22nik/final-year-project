const request = require('request');
const express = require("express");
const route = express.Router();
const https = require('https');
const axios = require('axios');
const Popular=require("../models/popular.js");
const Genre=require("../models/genre.js");
const moviedata=require("../models/Moviedata");
const { Console } = require('console');
const { insertMany } = require('../models/popular.js');
const User=require("../models/user");


module.exports.home= async function(req,res){
    var hash = new Object();
   
if(!req.isAuthenticated()){
  return res.render("login", {
    title: "Login",

  });
}
   
console.log("loggedin user email",req.user.email);   

    let actionData=await moviedata.find( { $and: [
        { visited:false },
        { genre_id:28 }
    ] }).limit(10);


    let comedyData=await moviedata.find({ $and: [
        { visited:false },
        { genre_id:35 }
    ] }).limit(10);
    
    let AdventureData=await moviedata.find({ $and: [
        { visited:false },
        { genre_id:12 }
    ] }).limit(10);
    
    let HorrorData=await moviedata.find({ $and: [
        { visited:false },
        { genre_id:27 }
    ] }).limit(10);

    let RomanceData=await moviedata.find({ $and: [
        { visited:false },
        { genre_id:10749 }
    ] }).limit(10);

    let familyData=await moviedata.find({ $and: [
        { visited:false },
        { genre_id:10751 }
    ] }).limit(10);
    hash.Action=(actionData);
    hash.Comedy=comedyData;
    hash.Adventure=AdventureData;
    hash.Horror=HorrorData;
    hash.Romance=RomanceData;
    hash.family=familyData;
   

   res.render("moviehome",{
     data:hash,
     name:req.user.email       
   });
}

module.exports.popular=async function(req,res){

let arr=[];

//     for(let i=1;i<=10;i++){
//     axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=19dedc791dc255982eaf84be8a93012a&language=en-US&page=${i}`)
//      .then(async response => {
//          let value=response.data.results;

//          for(let a of value){
//              let obj={};
//              obj.vote_average=a.vote_average;
//              obj.title=a.title,
//              obj.release_date = a.release_date;
//              obj.poster_path = a.poster_path;
//              obj.popularity=a.popularity;
//              obj.original_title=a.original_title;
//              obj.overview=a.overview;
//              obj.adult=a.adult;
//              obj.backdrop_path=a.backdrop_path;
//              console.log(a);
             
//             let results=await Popular.create({obj});
//           console.log(results);
//     }

//         res.send(arr); 

// })
//     }

let ar=[];

 let response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=19dedc791dc255982eaf84be8a93012a&language=en-US&page=1`);
    ar.push(response.data.results);

 let response2 = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=19dedc791dc255982eaf84be8a93012a&language=en-US&page=2`);
   ar.push(response2.data.results);

 let response3=await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=19dedc791dc255982eaf84be8a93012a&language=en-US&page=3`);
   ar.push(response3.data.results);

  let response4=await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=19dedc791dc255982eaf84be8a93012a&language=en-US&page=4`);
   ar.push(response4.data.results);

  let response5=await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=19dedc791dc255982eaf84be8a93012a&language=en-US&page=5`);
    ar.push(response5.data.results);

  let response6=await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=19dedc791dc255982eaf84be8a93012a&language=en-US&page=6`);
    ar.push(response6.data.results);

  let response7=await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=19dedc791dc255982eaf84be8a93012a&language=en-US&page=7`);
   ar.push(response7.data.results);


  let response8=await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=19dedc791dc255982eaf84be8a93012a&language=en-US&page=8`);
   ar.push(response8 .data.results);

   console.log(ar);

   res.render("popular",{
     popularMovie:ar,
     name:req.user.email
    });

//res.send(ar);
}

module.exports.genreSave=async function(req,res){

let api="https://api.themoviedb.org/3/genre/movie/list?api_key=19dedc791dc255982eaf84be8a93012a&language=en-US";
let response = await axios.get(api);
let data=response.data.genres 

try{
  for(let a of data){
     let b= await Genre.create({genre_id:a.id,genre_name:a.name});
   }
}catch(err){
    console.log(err+"error");
}

res.send("hii");

}

//--------------

module.exports.ratingsave = async function(req,res){
    
  if(req.body.user_rating >=7){
    console.log(req.body);
 let item=  await User.findOne({email:req.body.usernemail}); 
  
    let item2= await  moviedata.findOne({title:req.body.moviename});

        item.cart.push(item2.genre_id);
        item.save();
     await moviedata.updateOne({title:req.body.moviename},{visited:true});
       
 }else{
   let del=await moviedata.deleteOne({title:req.body.moviename});
 
 
  }


 res.redirect("/movie/home"); 
}












