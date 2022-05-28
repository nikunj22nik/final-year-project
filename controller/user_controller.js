const express = require("express");
const route = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { urlencoded } = require("body-parser");
const user_controller = require("../controller/user_controller");
const mail = require("../mailer/validateuser");
const Moviedata = require("../models/Moviedata");

//user signup

module.exports.signup_page = function (req, res) {
  res.render("signup");
};

module.exports.create = async function (req, res) {
  console.log(req.body);
  let num = Math.floor(Math.random() * 1111);

  let n = num.toString();

  //password and confirm pass word not match
  if (req.body.password != req.body.cpassword) {
    return res.render("signup", {
      error: "Password Not Match",
      title: "signup",
    });
  }

//password size is less than 7
  if (req.body.password.length < 7) {
    return res.render("signup", {
      error: "Password Should contain atleast 7 characters",
      title: "signup",
    });
  }

  //false age is provided by user

  if(req.body.age >100){
    return res.render("signup", {
      error: "Please Enter Correct age",
      title: "signup",
    });
  }



  const hash = await bcrypt.hash(req.body.password, 8);

  User.findOne({ email: req.body.email }, function (err, result) {
    if (err) {
      console.log("error is in singup", err);
      return;
    }

    if (!result) {
      let nameofuser = req.body.username.replace("\\s+", " ").trim();
      User.create(
        {
          name: nameofuser,
          email: req.body.email,
          password: hash,
          profession: req.body.profession,
          genre: req.body.genre,
          otp: n,
          gender: req.body.gender,
        },
        function (err, user) {
          if (err) {
            console.log("error in finding user in signup");
            return;
          }

          mail.newuser(user, n);
          //redirect user to verification page.
          res.render("verify");
        }
      );
    } else {
      return res.render("signup", {
        error: "Email Already Exist",
        title: "signup",
      });
    }
  });
};


//user verification 

module.exports.verify=async function(req,res){

  //remove extra spaces before and after
let verifyotp=req.body.otp;
 verifyotp = verifyotp.trim();

try {
  const userverify = await User.findOneAndUpdate(
    {
      $and: [{ otp:verifyotp }, { valid: false }],
    },
    { $set: { valid: true } }
  );

  if(userverify !=null){
  return res.render("login",{
    title:"login",
    msg:"You are Verified You can logedin now."
  });

}else{
  return res.render("verify",{
    title:"login",
    msg:"Wrong Otp.please Try again"
  });
}


} catch (err) {
  console.log(err);
  return res.render("signup", {
    title: "signup",
    error: "Something went wrong try again",
     });
  }
}




//user login
module.exports.loginpage=function(req,res){

  if (req.isAuthenticated()) {
    return res.redirect("/movie/home");
  }else{
   return res.render("login", {
    title: "Login",
      });
  }
}

module.exports.login = function (req, res) {
  console.log("welcome to login page");
  if (req.isAuthenticated()) {
    return res.redirect("/movie/home");
  }else{

  return res.render("login", {
    title: "Login",

  });
}
};


module.exports.signout = function (req, res) {
  req.logout();
  console.log("loggedout");
  req.flash("success", "Signout Succesfully");

  return res.redirect("/user/login");
};


module.exports.recommendation=async function(req,res){
  console.log(req.user.email);    
  let useremail=req.user.email;
      const user=await User.findOne({email:useremail});
      console.log(user.cart);
let cart=[];
       cart=user.cart;
      
      const movieGenre = new Set();

    for(let i=0;i<cart.length;i++){
      movieGenre.add(cart[i]);
    }

    let recommendationdata=[];

   for (const moviegenre of movieGenre) {
      const content=await Moviedata.find({genre_id:moviegenre}).limit(60);
       recommendationdata.push(content); 
    }
let returndata=[];
    for(let movie of recommendationdata){
     
        console.log(movie);

    let u=await Moviedata.findOne( {$and: [{ count: { $lt: 1 } }, { title:movie.title }]});
    returndata.push(u);
        u.count=1;
        u.save();
  
        console.log(u);
     }
    
console.log(returndata);
    
    return res.render('recommendationpage',{
        data:returndata});

}



