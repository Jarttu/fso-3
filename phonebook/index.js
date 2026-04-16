require('dotenv').config()
const path = require('path');
const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
const Person = require('./models/person')

const app = express();

app.use(cors());
app.use(express.json())

app.use(express.static(path.join(__dirname, 'dist')));

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => res.json(persons))
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
});

app.get('/info', (request, response, next) => {
    Person.find({}).then(persons => {
        const personsCount = persons.length;
        const date = new Date();

        response.send(`
            <p>Phonebook has info for ${personsCount} people</p>
            <p>${date}</p>
        `)
    }).catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id;

    Person.findByIdAndDelete(id)
        .then(() => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.post('/api/persons', (request, response, next) => {
    const { name, number } = request.body;

    if (!name || !number) {
        return response.status(400).json({
            error: 'name or number missing'
        });
    }

    const person = new Person({
        name,
        number
    });

    person.save()
        .then(savedPerson => {
            response.status(201).json(savedPerson);
        })
        .catch(error => next(error));
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})