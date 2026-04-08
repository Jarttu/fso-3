const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb://Jarttu:${password}@ac-v21h6rd-shard-00-00.2ksb0xe.mongodb.net:27017,ac-v21h6rd-shard-00-01.2ksb0xe.mongodb.net:27017,ac-v21h6rd-shard-00-02.2ksb0xe.mongodb.net:27017/?ssl=true&replicaSet=atlas-guov15-shard-0&authSource=admin&appName=phonebook`

mongoose.set('strictQuery', false)
mongoose.connect(url, { family: 4 })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,  
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(persons => {
        console.log('phonebook:')
        persons.forEach(p => {
            console.log(`${p.name} ${p.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name,
        number,
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}