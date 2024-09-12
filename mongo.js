const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('missing password, name and number arguments')
  process.exit(1)
}
// else if (process.argv.length < 4) {
//   console.log('missing name and number arguments')
//   process.exit(1)
// } else if (process.argv.length < 5) {
//   console.log('missing number arguments')
//   process.exit(1)
// }

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const uri =
  `mongodb+srv://undjonline:${password}@full-stack-open-cluster.aprbt.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=full-stack-open-cluster`

mongoose.set('strictQuery', false)

mongoose.connect(uri)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (password && !name && !number) {
  Person.find({}).then(persons => {
    console.log('phonebook:')
    persons.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (password && name && number) {

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
