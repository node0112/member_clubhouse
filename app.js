var createError = require('http-errors');
var express = require('express');
const bcrypt = require("bcryptjs")
var path = require('path');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var cookieParser = require('cookie-parser');
require('dotenv').config()
var mongoose = require("mongoose")

var usersRouter = require('./routes/users');
var appRouter = require('./routes/appRouter')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const User = require("./models/user")


passport.use(
  new LocalStrategy((username, password, done)=>{
    User.findOne({username: username},(err, user)=>{
      if(err) return done(err)
      if(!user){
        return done(null, false, {message :"Incorrect Username"})
      }
      bcrypt.compare(password,user.password, (err,result)=>{
        if(result) return done(null, user);
        else return done(null,false,{message: 'Incorrect Password'})
      })
    })
  })
)

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  })
});


app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const mongoDb = process.env.mongoURL;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

app.use('/users', usersRouter);
app.use('/', appRouter)


 



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
