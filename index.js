const express = require("express");
const app = express();
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

const morgan = require('morgan');

morgan.token('type', (req, res) => req.headers['content-type']);

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/api/persons", (request, response) =>{
    response.json(persons)
})

app.get("/api/persons/:id", (request, response) =>{
    const id = Number(request.params.id)
    const person = persons.find(n => n.id === id)
    
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete("/api/persons/:id", (request, response) =>{
    const id = Number(request.params.id)
    console.log(id)
    persons = persons.filter(n => n.id !== id)
    
    response.status(204).end()
})

app.get("/info", (request, response)=>{
    const numberPersons = persons.length
    const textPersons = "Phonebook has info for " + numberPersons + " people"
    const date = new Date()
    console.log(numberPersons)
    response.send(
        `<p>${textPersons}</p><p>${date}</p>`
    )
})

const generateId = () => {
    return Math.floor(Math.random() * 1_000_000) + 1; 
};

app.post("/api/persons/", (request, response) => {
    const { name, number } = request.body;

    if (name && number) {
        const flag = persons.some((p) => p.name === name);

        if (flag) {
            return response.status(400).json({ error: 'name must be unique' });
        }

        const newPerson = {
            id: generateId(),
            name,
            number,
        };

        persons = persons.concat(newPerson);
        return response.status(201).json(newPerson); 
    }

    return response.status(400).json({ error: 'name or number not found' }); 
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})