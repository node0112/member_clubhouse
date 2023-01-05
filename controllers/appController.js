const Message = require("../models/message")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const passport = require("passport");
const { body, validationResult } = require("express-validator"); //validator
const { DateTime } = require("luxon");
const async = require("async")


exports.index = (req,res)=>{
    res.render("index", {user: req.user})
  }


exports.log_in_get =(req,res,next)=>{
    res.render("login-form",{user: undefined})
}
exports.log_in_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })

exports.sign_up_get = (req,res,next)=>{
    res.render("signup-form",{errors:[],user: undefined})
}  

exports.sign_up_post = [
    body("username","Username Must Not Be Empty or Exceed 30 Characters")
    .trim()
    .isLength({min:3})
    .escape(),
    body("password", "Password must not be empty")
    .trim()
    .isLength({min : 3})
    .escape(),
    body("confirmPassword", "Confirm Password must not be empty")
    .trim()
    .isLength({min : 3})
    .escape(),
  
    //check custom password
    body("confirmPassword", "Passwords do not match")
    .custom((value, { req }) => value === req.body.password)
    .escape(),
  
    (req,res, next)=>{
      const errors = validationResult(req);
  
      if(!errors.isEmpty()){
        console.log(errors)
        res.render("signup-form",{errors: errors.array()})
        return
      }
        //if there are no errors save the user
      bcrypt.hash(req.body.password,10,(err,hashedPassword)=>{
        if(err) return next(err)
        const user = new User({
            username : req.body.username,
            password : hashedPassword
        }).save(err=>{
            if(err) return next(err)
            res.redirect("/")
        })
      })
    }
  ]

exports.log_out=(req,res,next)=>{
  req.logout(function(err){
    if(err) return next(err)
    res.redirect("/")
  })
}

//message controllers

exports.message_get=(req,res,next)=>{
  res.render("message_form",{user: undefined,errors: []})
}

exports.message_post = [
  body("title", "Title must have at least 3 characters!")
  .trim()
  .isLength({min: 3})
  .escape(),
  body("message", "Message must have at least 3 characters!")
  .trim()
  .isLength({min: 3})
  .escape(),

  (req,res,next)=>{
    const errors = validationResult(req)

    const currDate = new Date()

    const dateFromated = DateTime.fromJSDate(currDate).toLocaleString(DateTime.DATE_MED)

    const message = new Message({
      title : req.body.title,
      message: req.body.message,
      time: dateFromated,
      user: req.params.id
    })

    if(!errors.isEmpty()){
      res.render("message_form", {user:req.user, errors: errors.array()})
      return
    }

    message.save((err)=>{
      if(err)return  next(err)
      res.redirect("/messageboard")
    })
  }
]

exports.messageboard = (req,res,next)=>{
  async.parallel(
    {
      message_list(callback){
        Message.find({})
        .populate("user")
        .exec(callback)
      },
    },
    (err,results)=>{
      if(err) return next(err)
      res.render("messageboard",{user:req.user,messages:results.message_list})
    }
  )
}