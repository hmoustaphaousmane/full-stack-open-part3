require('dotenv').config()
const mongoose = require('mongoose')

const uri = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(uri)
  .then(result => console.log('connected to MongDB'))
  .catch(error => console.log('error connecting to MongoDB:', error.message))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    // custom validator
    validate: {
      validator: (v) => /^\d{2}-\d+$/.test(v),
      message: props => `${props.value} is not a valid phone number`
    },
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
