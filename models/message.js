const express = require('express')
const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    title: {type: String, required: true, maxLength: 100},
    message: {type: String, required: true},
    time: {type: Date, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, required: true}
})

module.exports = mongoose.model("Message" , MessageSchema)