const express = require('express')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, maxLength: 30},
    password: {type: String, required: true},
})

module.exports = mongoose.model("User" , UserSchema)