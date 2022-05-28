const express=require("express");
const route=express.Router();
const passport=require("passport");
const movie_controller=require("../controller/movie_controller");
const fillmoviedata=require("../controller/fillmoviedata_controller.js");


route.get("/home",movie_controller.home);
route.get("/popular",movie_controller.popular);
route.get("/genresave",movie_controller.genreSave);
route.post("/filldata",fillmoviedata.fillData);
route.post("/ratingform",movie_controller.ratingsave);

module.exports=route;