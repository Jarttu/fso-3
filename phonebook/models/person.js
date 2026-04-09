const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

module.exports = mongoose.model('Person', personSchema)